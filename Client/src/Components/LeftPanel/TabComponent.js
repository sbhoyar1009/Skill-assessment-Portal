import React from "react";

export const TabComponent = (props) => {
  return (
    <a
      className={props.active ? "nav-link active" : "nav-link"}
      id={props.id + "-tab"}
      data-toggle="pill"
      href={"#" + props.id}
      role="tab"
      aria-controls={props.id}
      aria-selected="true"
    >
      <span style={{ marginRight: 5 }}>{props.icon}</span>
      {props.name}
    </a>
  );
};
