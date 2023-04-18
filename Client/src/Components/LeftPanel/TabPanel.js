import React from "react";
import { TabComponent } from "./TabComponent";
import { RiDashboardFill } from "react-icons/ri";

export const TabPanel = (props) => {
  return (
    <div className="tabs">
      <div
        className="nav flex-column nav-pills "
        id="v-pills-tab"
        role="tablist"
        aria-orientation="vertical"
      >
        <TabComponent
          name={"Dashboard"}
          icon={<RiDashboardFill />}
          id={"v-pills-home"}
          active={"false"}
          clickable={"false"}
        />
        {props.Tabs.map((tab, index) => {
          if (index === 0) {
            return null;
          } else {
            return (
              <TabComponent
                key={index}
                name={tab.name}
                icon={tab.icon}
                id={tab.id}
              />
            );
          }
        })}
      </div>
    </div>
  );
};
