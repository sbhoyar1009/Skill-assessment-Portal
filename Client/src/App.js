import React, { createContext, useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import LastPage from "./Components/Admin/LastPage";
import Login from "./Components/Auth/Login";
import AlertComponent from "./Components/Layouts/AlertComponent";
import "./Assets/Styles/App.css";
import { ThemeProvider } from "@material-ui/core/styles";
import { theme } from "./Assets/Styles/jsStyles";
import PreLoader from "./Components/Layouts/PreLoader";
import TestsPage from "./Components/TestTrackSelect/TestsPage";
export const UserContext = createContext(null);

function App() {
  const [authenticated, setauthenticated] = useState(false);
  const [user, setUser] = useState({});
  const [alertOpen, setAlertOpen] = useState([false]);
  const [isLoading, setisLoading] = useState(true);

  const [currentstate, setCurrentstate] = useState({
    user: user,
    authenticated: authenticated,
  });

  useEffect(() => {
    setisLoading(false);
  }, []);

  function authStatus(user) {
    if (user !== null && user !== []) {
      setUser(user);
      let newObj = { ...currentstate };
      newObj.user = user;
      setCurrentstate(newObj);
      setauthenticated(true);
    } else {
      setUser(null);
      let newObj = { ...currentstate };
      newObj.user = null;
      newObj.authenticated = false;
      setCurrentstate(newObj);
      setauthenticated(false);
      console.log(user);
    }
  }

  const handleAlert = (type, msg) => {
    setAlertOpen([true, type, msg]);
    setTimeout(() => {
      setAlertOpen(false);
    }, 5000);
  };

  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setAlertOpen(false);
  };

  const UserData = {
    currentstate,
    authStatus,
    setCurrentstate,
    setUser,
    user,
    handleAlert,
    setisLoading,
  };

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <div className="App">
          {UserData.user !== null || UserData.user !== undefined ? (
            <>
              <AlertComponent
                data={alertOpen}
                handleAlertClose={handleAlertClose}
              />
              {isLoading ? <PreLoader /> : ""}
              <Switch>
                <Route exact path="/">
                  <UserContext.Provider value={UserData}>
                    {!authenticated ? (
                      <Login />
                    ) : user && user.isAdmin ? (
                      <LastPage />
                    ) : (
                      <TestsPage />
                    )}
                  </UserContext.Provider>
                </Route>
              </Switch>
            </>
          ) : (
            ""
          )}
        </div>
      </ThemeProvider>
    </Router>
  );
}

export default App;
