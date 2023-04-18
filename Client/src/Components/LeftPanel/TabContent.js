import React from "react";

const TabContent = (props) => {
  return (
    <div
      className={props.active ? "tab-pane fade show active" : "tab-pane fade"}
      id={props.id}
      role="tabpanel"
      aria-labelledby={props.id + "-tab"}
    >
      {props.content}
    </div>
  );
};

export default TabContent;
