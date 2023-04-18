import React, { useEffect, useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import Checkbox from "@material-ui/core/Checkbox";
import TableContainer from "@material-ui/core/TableContainer";
import {
  DeleteAssignmentfromTest,
  DeleteAssignmentsfromTest,
  GetAssignmentsofTest,
} from "../../../../Util/assignment";
import Paper from "@material-ui/core/Paper";
import { StyledTableRow } from "../../../../Assets/Styles/jsStyles";
import { UserContext } from "../../../../App";
import { MdDelete } from "react-icons/md";

const useStyles = makeStyles({
  table: {
    minWidth: "50%",
  },
  defineWidth: {
    width: "50%",
  },
});

function createData(name, action) {
  return { name, action };
}

export default function AssignmentsTable(props) {
  const userData = useContext(UserContext);
  const { _id } = props;
  const [assgns, setassgns] = useState([]);
  const classes = useStyles();
  const rows = [];
  var [removeAssignments, setremoveAssignments] = useState([]);
  const [active, setActive] = useState(true);

  const getAssignments = (id) => {
    GetAssignmentsofTest(id)
      .then((res) => {
        setassgns(res.data.assignments);
        userData.setisLoading(false);
      })
      .catch((err) => {
        console.log(err);
        userData.setisLoading(false);
      });
  };

  useEffect(() => {
    userData.setisLoading(true);
    getAssignments(_id);
  }, [_id]);

  const deleteAssignment = (assignments) => {
    if (assignments.length === 0) {
      userData.handleAlert("error", "Please select assignments");
    } else {
      userData.setisLoading(true);
      let ids = [];
      assignments.map((i) => {
        ids.push(assgns[i]._id);
      });

      DeleteAssignmentsfromTest(_id, ids)
        .then((res) => {
          if (res.data.status === "success") {
            userData.handleAlert("success", res.data.message);
            getAssignments(_id);
          }
        })
        .catch((err) => {
          console.log(err);
          userData.setisLoading(false);
          userData.handleAlert("error", "Something went wrong");
        });
      setremoveAssignments([]);
      userData.setisLoading(false);
    }
  };

  assgns.map((assignment) => {
    return rows.push(
      createData(
        assignment.title,
        <MdDelete size="20" style={{ color: "#E34234", cursor: "pointer" }} />
      )
    );
  });

  return (
    <>
      {rows.length !== 0 ? (
        <div>
          <TableContainer component={Paper} className={classes.defineWidth}>
            <Table className={classes.table} aria-label="simple table">
              <TableBody>
                {rows.map((row, index) => (
                  <StyledTableRow key={row.name}>
                    <TableCell component="th" scope="row">
                      {index + 1 + ")  " + row.name}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {/* <span
                      onClick={() => {
                        deleteAssignment(index);
                      }}
                    >
                      {row.action}
                    </span> */}
                      <Checkbox
                        onChange={(event) => {
                          if (removeAssignments.includes(index)) {
                            removeAssignments = removeAssignments.filter(
                              (item) => item !== index
                            );
                          } else {
                            removeAssignments.push(index);
                          }

                          setremoveAssignments(removeAssignments);
                          setActive(!active);
                        }}
                      />
                    </TableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <div class="p-5">
            <button
              className="btn btn-primary hvr-float-shadow btn-submit"
              onClick={() => {
                deleteAssignment(removeAssignments);
              }}
            >
              Delete selected assignments
            </button>
          </div>
        </div>
      ) : (
        "You have deleted all the assignments of this test."
      )}
    </>
  );
}
