import React, { useState, createContext, useContext } from "react";
import AssignmentList from "../AssignmentPage/AssignmentList";
import Tests from "./Tests";
import Header from "../Layouts/Header";
import { CheckForks, isTestActive } from "../../Util/test";
import { UserContext } from "../../App";

export const TestData = createContext(null);

const TestsPage = () => {
  const blankTest = {
    testTitle: "",
    testId: "",
    // isAccess: null,
    startTime: null,
    endTime: null,
    isActive: false,
  };

  const [testSelected, settestSelected] = useState(false);
  const [currentTestData, setCurrentTestData] = useState(blankTest);

  const userData = useContext(UserContext);

  async function testSelect(testId, testName, startTime, endTime) {
    if (testSelected) {
      setCurrentTestData(blankTest);
      localStorage.removeItem("currentTestData");
      settestSelected(false);
    } else {
      isTestActive(testId)
        .then((res) => {
          let newObj = { ...currentTestData };
          newObj.testTitle = testName;
          newObj.testId = testId;
          newObj.startTime = startTime;
          newObj.endTime = endTime;
          newObj.isActive = res.data.isActive;
          setCurrentTestData(newObj);
          settestSelected(true);
        })
        .catch((err) => {
          alert("Something went wrong, contact admin");
          userData.setisLoading(false);
        });
      CheckForks(testId, userData.user.username);
    }
  }

  const testDetails = {
    currentTestData,
    setCurrentTestData,
    testSelect,
  };
  return (
    <div>
      <TestData.Provider value={testDetails}>
        <div className="container">
          <Header profile={true} />
        </div>

        {!testSelected ? (
          <Tests filterCategory={"All"} title={"All Tests"} />
        ) : (
          <AssignmentList />
        )}
      </TestData.Provider>
    </div>
  );
};

export default TestsPage;
