import React from "react";
import { QuestionComponent } from "./QuestionComponent";

const TabPanel = (props) => {
  const Questions = props.QueNo;

  const Questions1 = Questions[0];
  const sliced = Questions.slice(1);
  var question = sliced.map((q) => {
    return <QuestionComponent key={q._id} name={q.name} id={q.id} />;
  });
  return (
    <div className="tabs">
      <div
        className="nav flex-column nav-pills"
        id="v-pills-tab"
        role="tablist"
        aria-orientation="vertical"
      >
        <h6>Q.</h6>
        <QuestionComponent
          name={Questions1.name}
          id={Questions1.id}
          active={"true"}
        />
        {question}
      </div>
    </div>
  );
};

export default TabPanel;
