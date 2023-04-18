import React, { useEffect, useState } from "react";
import Header from "../Layouts/Header";
import LeaderBoard from "../LeaderBoard/LeaderBoard";
import Profile from "../Profile/Profile";
import AssignmentPage from "./AssignmentPage";
import { UserContext } from "../../App";
import { TestData } from "../TestTrackSelect/TestsPage";
// import { testLeaderBoard } from "../../Util/leaderboard";
import Timer from "../Layouts/Timer";

function AssignmentList() {
  const [profile, setprofile] = React.useState(false);
  // const [leaderBoard, setleaderBoard] = useState([]);
  const testFunctions = React.useContext(TestData);
  const userData = React.useContext(UserContext);
  useEffect(() => {
    userData.setisLoading(true);
    // testLeaderBoard(testFunctions.currentTestData.testId)
    //   .then((res) => {
    //     setleaderBoard(res.data);
    //     userData.setisLoading(false);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     userData.setisLoading(false);
    //   });
  }, [testFunctions.currentTestData.testId]);

  const user = React.useContext(UserContext);

  function renderProfile() {
    setprofile(!profile);
  }

  return (
    <div className="assignments">
      <Header
        renderProfile={renderProfile}
        profile={profile}
        testLink={true}
        testSelect={testFunctions.testSelect}
      />
      <div className="row">
        <div className="col-md-9">
          {
            <div className="leftbody">
              <AssignmentPage />
            </div>
          }
        </div>
        <div
          className="col-md-3"
          style={{ borderLeft: "2px solid #2c3d1342", paddingTop: "6rem" }}
        >
          {testFunctions.currentTestData.isActive ? (
            <div
              style={{
                backgroundColor: "#b2ff4532",
                padding: "1rem",
                width: "90%",
                marginLeft: "5%",
                borderRadius: "5px",
                textAlign: "center",
              }}
            >
              <Timer
                startTime={testFunctions.currentTestData.startTime}
                endTime={testFunctions.currentTestData.endTime}
                isActive={testFunctions.currentTestData.isActive}
              />
            </div>
          ) : (
            ""
          )}
          {!profile ? (
            <Profile user={user} test={testFunctions.currentTestData} />
          ) : (
            // <LeaderBoard leaderBoardData={leaderBoard} />
            <LeaderBoard testId={testFunctions.currentTestData.testId} />
          )}
        </div>
      </div>
    </div>
  );
}

export default AssignmentList;
