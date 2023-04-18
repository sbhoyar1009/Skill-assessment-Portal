import React, { useState, useContext } from "react";
import { ImArrowLeft2 } from "react-icons/im";
import { UserContext } from "../../../App";
import { setTestActive, setTestInActive } from "../../../Util/test";
import TestTabs from "./TestTabs";

const ShowTest = (props) => {
  const { test, back } = props;
  let userData = useContext(UserContext);
  const [checkedBox, setcheckedBox] = useState(test.isActive);

  const setActive = (test) => {
    let test1 = { ...test };
    test1.isActive = checkedBox;
    if (checkedBox) {
      setTestInActive(test1)
        .then((res) => {
          if (res.data.status === "success") {
            userData.handleAlert("success", res.data.msg);
            setcheckedBox(false);
          } else {
            userData.handleAlert("error", res.data.msg);
            setcheckedBox(true);
          }
        })
        .catch((err) => {
          userData.handleAlert("error", "Error while deactivating test");
        });
    } else {
      setTestActive(test1)
        .then((res) => {
          if (res.data.status === "success") {
            userData.handleAlert("success", res.data.msg);
            setcheckedBox(true);
          } else {
            userData.handleAlert("error", res.data.msg);
            setcheckedBox(false);
          }
        })
        .catch((err) => {
          userData.handleAlert("error", "Error while activating test");
        });
    }
  };
  
  return (
    <div>
      <div className="row check-box">
        <div className="col-md-1">
          <div
            onClick={back}
            style={{
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "40px",
              height: "40px",
              color: "black",
              borderRadius: "100%",
              backgroundColor: "#b2ff45fd",
            }}
          >
            <ImArrowLeft2 />
          </div>
        </div>
        <div className="col-md-9">
          <h3>{test.displayTitle}</h3>
        </div>
        <div className="col-md-2">
          <span>Activate Test</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={checkedBox}
              onClick={() => {
                setActive(test);
              }}
              onChange={(e) => {
                setcheckedBox(!checkedBox);
              }}
              tabIndex={-1}
              disableRipple
              color="#b0ff45"
            />
            <div className="slider"></div>
          </label>
        </div>
      </div>
      <br />
      <TestTabs test={test} flag={checkedBox} />
    </div>
  );
};

export default ShowTest;
