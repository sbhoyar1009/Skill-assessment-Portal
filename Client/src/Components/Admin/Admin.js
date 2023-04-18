import React, { Component } from "react";
import { TabPanel } from "../LeftPanel/TabPanel";
import "../../Assets/Styles/Admin.css";
import TabContent from "../LeftPanel/TabContent";
import AddTest from "./TestCreate/AddTest";
// import AddTrack from "./AddTrack";
// import AddParticipant from "./AddParticipant";
import AddAssgn from "./AssignmentCreate/AddAssgn";
import AdminHome from "./HomePage/AdminHome";
import { BsFileEarmarkPlus, BsList } from "react-icons/bs";
import { FiFilePlus } from "react-icons/fi";
import { RiDashboardFill } from "react-icons/ri";
import AssignmentList from "./AssignmentList";

export default class Admin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      Tabs: [
        {
          id: "v-pills-home",
          icon: <RiDashboardFill />,
          name: "Dashboard",
          content: <AdminHome />,
        },
        {
          id: "v-pills-add-participant",
          icon: <BsList />,
          name: "Assignment List",
          content: <AssignmentList />,
        },
        {
          id: "v-pills-add-assignment",
          icon: <FiFilePlus />,
          name: "Add Assignment",
          content: <AddAssgn />,
        },
        {
          id: "v-pills-add-test",
          icon: <BsFileEarmarkPlus />,
          name: "Create Test",
          content: <AddTest />,
        },

        // {
        //   id: "v-pills-add-track",
        //   name: "Add Track",
        //   content: <AddTrack />,
        // }
        // {
        //   id: "v-pills-add-assignment",
        //   icon: <FiFilePlus />,
        //   name: "Add Assignment",
        //   content: <AddAssgn />,
        // },
      ],
    };
  }

  render() {
    const Tab1 = this.state.Tabs[0];
    const Tabs = this.state.Tabs.map((tab, index) => {
      if (index === 0) {
        return null;
      } else {
        return <TabContent content={tab.content} id={tab.id} key={index} />;
      }
    });
    return (
      <div className="tab-panel">
        <div className="row">
          <div className="col-md-2">
            <TabPanel Tabs={this.state.Tabs} />
          </div>

          <div className="col-md-9">
            <div className="row">
              <div className="col-12 scroll-div">
                <div className="tab-content" id="v-pills-tabContent">
                  <TabContent
                    content={Tab1.content}
                    id={Tab1.id}
                    active={true}
                  />
                  {Tabs}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
