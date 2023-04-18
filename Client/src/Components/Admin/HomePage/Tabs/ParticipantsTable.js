import React, { useEffect, useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Checkbox from "@material-ui/core/Checkbox";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import { StyledTableRow } from "../../../../Assets/Styles/jsStyles";
import { getTestByID } from "../../../../Util/test";
import { UserContext } from "../../../../App";
import { MdDelete } from "react-icons/md";
import { deleteParticipantOfTest } from "../../../../Util/test";

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

const ParticipantsTable = (props) => {
  const userData = useContext(UserContext);
  const { _id } = props;
  const classes = useStyles();
  const [participants, setparticipants] = useState([]);
  const rows = [];
  var [removeParticipants, setremoveParticipants] = useState([]);
  const [active, setActive] = useState(true);
  const getParticipants = (id) => {
    getTestByID(id)
      .then((res) => {
        setparticipants(res.data.participants);
        userData.setisLoading(false);
      })
      .catch((err) => {
        console.log("error while fetching participants", err);
        userData.setisLoading(false);
      });
  };

  useEffect(() => {
    userData.setisLoading(true);
    getParticipants(_id);
  }, [_id]);
  if (participants) {
    participants.map((user) => {
      return rows.push(
        createData(
          user
        )
      );
    });
  }
  
  const deleteParticipant = (participants) => {
    if (removeParticipants.length === 0) {
      userData.handleAlert("error", "Please select participants");
    } else {
      userData.setisLoading(true);
      // participants.map((username) => {
        let userToDelete = [];
      participants.map((i) => {
        userToDelete.push(i);
      });
        deleteParticipantOfTest(_id, participants)
          .then((res) => {
            if (res.data.status === "success") {
              userData.handleAlert("success", res.data.message);
              getParticipants(_id);
              userData.setisLoading(false);
            } else {
              userData.setisLoading(false);
              userData.handleAlert("error", res.data.message);
            }
          })

          .catch((err) => {
            console.log(err);
            userData.setisLoading(false);
            userData.handleAlert("error", "Something went wrong");
          });
      // });
      setremoveParticipants([]);
    }
  };

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
                      <Checkbox
                        onChange={(event) => {
                          if (removeParticipants.includes(row.name)) {
                            removeParticipants = removeParticipants.filter(
                              (item) => item !== row.name
                            );
                          } else {
                            removeParticipants.push(row.name);
                          }
                          setremoveParticipants(removeParticipants);
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
            {/* <button className="btn btn-primary hvr-float-shadow btn-submit"> */}
            <button
              className="btn btn-primary hvr-float-shadow btn-submit"
              onClick={() => {
                deleteParticipant(removeParticipants);
              }}
            >
              Delete selected participants
            </button>
          </div>
        </div>
      ) : (
        `No participants added yet to this test. To add participants, go to "Add Participants" tab`
      )}
    </>
  );
};

export default ParticipantsTable;
