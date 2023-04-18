import React, { useState, useContext, useEffect } from "react";
import { Button } from "@material-ui/core";
import { TestData } from "../TestTrackSelect/TestsPage";
import { UserContext } from "../../App";
import "./Styles/QuestionContent.css";

import Question from "./Question";

const QuestionContent = (props) => {
  const testData = useContext(TestData);
  const userData = useContext(UserContext);

  const URL = `https://${userData.currentstate.user.username
    .toLowerCase()
    .trim()}@ecode-gitlab.kpit.com/ecodetestgroup/userstestgroups-dummy/${
    testData.currentTestData.testTitle
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "") +
    "-" +
    userData.currentstate.user.username.toLowerCase().trim()
  }/${props.content.title.toLowerCase().trim().replace(/\s+/g, "-")}.git`;

  return (
    <div
      className={props.active ? "tab-pane fade show active" : "tab-pane fade"}
      id={props.id}
      role="tabpanel"
      aria-labelledby={props.id + "-tab"}
    >
      <Question content={props.content} URL={URL} />
    </div>
  );
};

export default QuestionContent;
