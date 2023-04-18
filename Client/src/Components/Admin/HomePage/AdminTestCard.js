import React, { useState, useRef, useEffect } from "react";
import Moment from "react-moment";
import {
  Card,
  CardContent,
  Button,
  Typography,
  Container,
} from "@material-ui/core";
import * as FaIcons from "react-icons/fa";
import { testCardStyles } from "../../../Assets/Styles/jsStyles";

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

const AdminTestCard = (props) => {
  const classes = testCardStyles();

  return (
    <Card
      className={classes.root}
      style={{ backgroundColor: props.test.isActive ? "" :  "lightgrey" }}
      raised={props.test.isActive ? true : false}
    >
      <CardContent>
        <div className={classes.visit_btn}  >
          {/* {toTitleCase(props.test.title)} */}
         {props.test.isHidden?  <FaIcons.FaEyeSlash />  : ""}  {"     "}
         
          {props.test.displayTitle}
        </div>
        <Container className={classes.Test_details}>
          <Typography className={classes.Test_details}>
            <FaIcons.FaLaptopCode style={{ marginRight: 10 }} size={20} />
            <strong>Competency:</strong> 
            <br />{props.test.trackName}
          </Typography>
          {/* <Typography className={classes.Test_details}>
            <FaIcons.FaLaptopCode style={{ marginRight: 10 }} size={20} />
            <strong>Sub Competency:</strong> 
            <br />{props.test.subCompetency}
          </Typography> */}
          <Typography className={classes.Test_details}>
            <strong>Starts on: </strong>
            <br />
            <FaIcons.FaCalendarDay style={{ marginRight: 5 }} size={15} />
            <Moment format="DD MMM, YYYY" date={props.test.startTime} />
            {/* <br /> */}
            {/* <strong>Start Time: </strong> */} :{" "}
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
            {/* <strong>Start Time: </strong> */} :{" "}
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

export default AdminTestCard;
