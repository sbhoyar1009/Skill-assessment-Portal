import { withStyles, makeStyles, createTheme } from "@material-ui/core";
import { TableRow,createMuiTheme } from "@material-ui/core";
import {green} from "@material-ui/core/colors/lime";
export const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

export const theme = createTheme({
  typography: {
    fontFamily: ["Montserrat", "sans-serif"].join(","),
  },
  palette: {
    primary: green,
  }
});

export const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.white,
    paddingTop: theme.spacing(5),
    marginTop: 3,
    overflow: "auto",
  },
  select: {
    width: 160,
  },
  selectass: {
    width: 200,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  addButton: {
    marginTop: "20px !important",
    marginBottom: "20px !important",
    marginLeft: "10px !important",
    backgroundColor: "#8ee905 !important",
    "&:hover": { backgroundColor: "#8ee905 !important" },
  },
  NextBtn: {
    backgroundColor: "black",
    color: "white",
    "&:hover": { backgroundColor: "black" },
  },
  submitButton: {
    marginTop: "20px",
    marginLeft: "87%",
    backgroundColor: "#8ee905",
    "&:hover": { backgroundColor: "#8ee905" },
  },
  table: {
    width: "100%",
    border: "1px solid #e0e0e0",
    marginTop: 20,
    backgroundColor: "#b2ff453b",
  },
  alert: {
    position: "fixed",
    top: 110,
    // bottom: 30,
    left: "40%",
    zIndex: 999,
  },
  ass_paper: {
    width: "100%",
    margin: 10,
  },
  // add_assignment_paper: {
  //   height: 200,
  // },
  test_paper: {
    width: "100%",
    height: 530,
    // overflow: "auto",
    marginTop: 5,
  },
  tracksPaper: {
    height: "auto",
  },
  skillSetpaper: {
    // marginTop: 200,
    backgroundColor: "#b2ff453b",
  },
}));

export const addAssignstyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.white,
    paddingTop: theme.spacing(3),
    overflow: "auto",
  },
  formControl: {
    // margin: theme.spacing(1),
    minWidth: 60,
  },
  title: {
    textAlign: "center",
    fontSize: "1.5rem",
    marginBottom: 5,
  },
  // textField: {

  // },
  submitAssignment: {
    marginTop: 15,
    backgroundColor: "#8ee905",
    "&:hover": { backgroundColor: "#8ee905" },
  },
  // table: {
  //   width: "90%",
  //   border: "1px solid #e0e0e0",
  //   marginTop: 10,
  //   marginBottom: 20,
  //   backgroundColor: "#b2ff453b",
  // },
  alert: {
    position: "fixed",
    top: 110,
    // bottom: 50,
    left: "35%",
    // left: "16%",
  },

  iconBtn: {
    marginRight: "42%",
    color: "red",
    padding: 0,
  },
}));

export const testCardStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    marginTop: 23,
    height: "260px",
    // backgroundColor: "#b2ff45cc",
    // flexDirection: "column",
    // justifyCotent: "flex-end",
    padding: "0.1rem",
    backgroundColor: "#8ee905e0",
    elevation: 0,
    "&:hover": {
      cursor: "pointer",
      boxShadow:
        "rgba(17, 17, 26, 0.05) 0px 4px 16px, rgba(17, 17, 26, 0.05) 0px 8px 32px;",
    },
  },

  title: {
    fontSize: 16,
    textAlign: "left",
    marginLeft: 25,
    marginBottom: 15,
    color: "black",
    width: "40%",
    borderBottom: "1px solid #000000",
  },
  visit_btn: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 15,
    backgroundColor: "transparent",
    color: "black",
  },
  Test_details: {
    marginTop: 5,
    fontSize: "15px !important",
    // display: "flex",
    textAlign: "left",
    [theme.breakpoints.between("500", "1000")]: {
      fontSize: 12,
    },
  },
}));


export const datePickerStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#b0ff45",
  }
}));
