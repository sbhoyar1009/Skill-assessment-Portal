import React, { useContext, useState } from "react";
import Moment from "react-moment";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import * as FaIcons from "react-icons/fa";
import { Container } from "@material-ui/core";
import { TestData } from "./TestsPage";
import { testCardStyles } from "../../Assets/Styles/jsStyles";
import { UserContext } from "../../App";
import Timer from "../Layouts/Timer";

const TestCard = (props) => {
  const classes = testCardStyles();
  const testData = useContext(TestData);
  const userData = useContext(UserContext);
  const loadTracks = () => {
    testData.testSelect(
      props.test._id,
      props.test.title,
      props.test.startTime,
      props.test.endTime
    );
    userData.setisLoading(true);
  };
  return (
    <Card
      className={classes.root}
      onClick={loadTracks}
      style={{ backgroundColor: props.test.isActive ? "" : "lightgrey" }}
      raised={props.test.isActive ? true : false}
    >
      <CardContent  >
        <div className={classes.visit_btn}>{props.test.title}</div>
        <Container className={classes.Test_details}>
          <Typography className={classes.Test_details}>
            <FaIcons.FaLaptopCode style={{ marginRight: 10 }} size={20} />
            <strong>Competency:</strong> {props.test.trackName}
          </Typography>
          <Typography className={classes.Test_details}>
            <FaIcons.FaLaptopCode style={{ marginRight: 10 }} size={20} />
            <strong>Subcompetency:</strong>
            <br /> {props.test.subCompetency}
          </Typography>
          <Typography className={classes.Test_details}>
            <strong>Starts on: </strong>
            <br />
            <FaIcons.FaCalendarDay style={{ marginRight: 5 }} size={15} />

            <Moment format="DD MMM, YYYY" date={props.test.startTime} />
            {/* <br /> */}
            {/* <strong>Start Time: </strong> */}
            <FaIcons.FaHourglassStart
              style={{ marginRight: 5, marginLeft: 8 }}
              size={15}
            />
            <Moment
              format="hh:mm A"
              date={props.test.startTime}
              style={{ textIndent: "10px" }}
            />
          </Typography>

          <Typography className={classes.Test_details}>
            <strong>Ends on: </strong>
            <br />
            <FaIcons.FaCalendarDay style={{ marginRight: 5 }} size={15} />

            <Moment format="DD MMM, YYYY" date={props.test.endTime} />
            {/* <br /> */}
            {/* <strong>Start Time: </strong> */}
            <FaIcons.FaHourglassEnd
              style={{ marginRight: 5, marginLeft: 8 }}
              size={15}
            />
            <Moment
              format="hh:mm A"
              date={props.test.endTime}
              style={{ textIndent: "10px" }}
            />
          </Typography>
        </Container>
      </CardContent>
    </Card>
  );
};

export default TestCard;
