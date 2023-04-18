import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Table from "./Tabs/Table";
import ReportTable from "./Tabs/ReportTable";
import { makeStyles } from "@material-ui/core/styles";
import AssignmentsTable from "./Tabs/AssignmentsTable";
import AddParticipant from "./Tabs/AddParticipant";
import ParticipantsTable from "./Tabs/ParticipantsTable";
import AddAssignment from "./Tabs/AddAssignment";

function TabPanel(props) {
  const { children, value, index, test, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      style={{ height: "60vh", overflowY: "auto" }}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function SimpleTabs(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  //const [assgns, setassgns] = useState([]);

  // useEffect(() => {
  //   GetAssignmentsofTest(props.test._id)
  //     .then((res) => {
  //       setassgns(res.data.assignments);
  //     })
  //     .catch((err) => console.log(err));
  // }, [props.test._id]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="simple tabs example"
          style={{ backgroundColor: "#b2ff45fd", color: "#000" }}
        >
          <Tab label="Overview" {...a11yProps(0)} />
          <Tab label="Participants" {...a11yProps(1)} />
          <Tab label="Add Participants" {...a11yProps(2)} />
          <Tab label="Assignments" {...a11yProps(3)} />

          <Tab label="Add Assignment" {...a11yProps(4)} />
          <Tab label="Report" {...a11yProps(5)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <Table test={props.test} isActive={props.flag} type={"TestDetails"} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ParticipantsTable _id={props.test._id} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <AddParticipant testId={props.test._id} />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <AssignmentsTable _id={props.test._id} />
      </TabPanel>

      <TabPanel value={value} index={4}>
        <AddAssignment testId={props.test._id} testData={props.test} />
      </TabPanel>
      <TabPanel value={value} index={5}>
        <ReportTable testID={props.test._id} testName={props.test.title} />
      </TabPanel>
    </div>
  );
}
