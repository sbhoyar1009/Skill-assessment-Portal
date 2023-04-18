import React from "react";

export const QuestionComponent = (props) => {
  return (
    // {props.isActive?(
    <a
      className={props.active ? "nav-link active" : "nav-link"}
      id={props.id + "-tab"}
      data-toggle="pill"
      href={"#" + props.id}
      role="tab"
      aria-controls={props.id}
      aria-selected="true"
    >
      {props.name}
    </a>
    // ):"Test is inActive"
  );
};
