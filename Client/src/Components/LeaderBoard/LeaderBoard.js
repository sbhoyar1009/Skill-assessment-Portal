import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../App";
import { testLeaderBoard } from "../../Util/leaderboard";
import { cleanTitle } from "../../Util/regex";
import Row from "./Row";

// import { FaSearch } from "react-icons/fa";

function LeaderBoard(props) {
  // const [leaderBoard, setleaderBoard] = useState(props.leaderBoardData);
  const [leaderBoard, setleaderBoard] = useState([]);
  const userData = React.useContext(UserContext);

  // const displaySearchUsernames = (value) => {
  //   if (value !== null && value !== "" && value !== undefined) {
  //     const searchUsernames = leaderBoard.filter((userRecord) => {
  //       const regex = new RegExp(`${cleanTitle(value)}`, "gi");
  //       return userRecord.username.match(regex);
  //     });
  //     setleaderBoard(searchUsernames);
  //   } else {
  //     setleaderBoard(props.leaderBoardData);
  //   }
  // };

  useEffect(() => {
    userData.setisLoading(true);
    testLeaderBoard(props.testId)
      .then((res) => {
        setleaderBoard(res.data);
        userData.setisLoading(false);
      })
      .catch((err) => {
        console.log(err);
        userData.setisLoading(false);
      });
  }, []);

  return (
    <div>
      <div className="leaderboard">
        <div className="content">
          <h5>Leaderboard</h5>
          {/* <div>
            <input
              className="form-control leaderboard-search"
              placeholder="Search username..."
              onChange={(e) => {
                displaySearchUsernames(e.target.value);
              }}
            />
          </div> */}
          <p></p>
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Username</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {leaderBoard.map((user, index) => {
                return (
                  <Row
                    rank={user.rank}
                    username={user.username}
                    score={user.totalScore}
                    key={index}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {/* <div>
        <button id="view-leaderboard" className="btn btn-default btn-leader">
          View full Leaderboard
        </button>
      </div> */}
    </div>
  );
}

export default LeaderBoard;
