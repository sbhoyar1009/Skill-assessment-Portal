import React, { useContext, useState } from "react";
import { Paper } from "@material-ui/core";
import { ExcelRenderer } from "react-excel-renderer";
import { UserContext } from "../../../../App";
import { addParticipantsToTest } from "../../../../Util/test";

const AddParticipant = (props) => {
  const [participants, setparticipants] = useState([]);
  const user = useContext(UserContext);
  function onParticipantsChange(p) {
    let participants = [...new Set([...p])];
    console.log(participants);
    setparticipants(participants);
  }

  const fileHandler = (event) => {
    const filename = event.target.files[0].name;
    const fileExtension = filename.split(".").pop();
    if (fileExtension === "xlsx") {
      let fileObj = event.target.files[0];
      if (fileObj.size / 1024 < 100) {
        //just pass the fileObj as parameter
        ExcelRenderer(fileObj, (err, resp) => {
          if (err) {
            console.log(err);
          } else {
            const usernames = [];

            if (resp.cols.length !== 1) {
              // console.log("Invalid EXCEL");
              user.handleAlert(
                "error",
                "Excel should contain only one column "
              );
              event.target.value = null;
            } else {
              resp.rows.map((row, index) => {
                if (index !== 0 && row[0] !== undefined && row[0] !== null) {
                  usernames.push(row[0]);
                }
              });
              // console.log(resp.cols.length);
              // console.log(usernames);
              if (usernames.length === 0) {
                user.handleAlert(
                  "error",
                  "Enter atleast one participant in the Excel."
                );
                event.target.value = null;
              } else {
                onParticipantsChange(usernames);
              }
            }
          }
        });
      } else {
        event.target.value = null;
        user.handleAlert("error", "File size exceeded");
      }
    } else {
      event.target.value = null;
      user.handleAlert("error", "Please upload Excel file.");
    }
  };

  const addParticipants = () => {
    addParticipantsToTest(participants, props.testId)
      .then((res) => {
        user.setisLoading(false);
        if (res.data.invalidUsernames && res.data.invalidUsernames.length > 0) {
          user.handleAlert("success", `Participants added successfully !!!`);
        } else {
          user.handleAlert("success", `Participants added successfully !!!`);
        }

        document.getElementById("file-upload").value = null;
      })
      .catch((err) => {
        user.setisLoading(false);
        user.handleAlert("error", `Something went Wrong!!!`);
        console.log(err);
      });
  };
  return (
    <div>
      <Paper style={{ padding: "2rem", height: "250px" }}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            user.setisLoading(true);
            addParticipants();
          }}
        >
          <div className="form-group col-md-6">
            <label htmlFor="file=upload">Upload File (.xlsx)*</label>
            <div className="input-group mb-3">
              <input
                type="file"
                onChange={fileHandler.bind(this)}
                id="file-upload"
                required={true}
                style={{
                  padding: "10px",
                  border: "0.01rem solid gray",
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary hvr-float-shadow mt-5"
          >
            Add Participant
          </button>
        </form>
      </Paper>
    </div>
  );
};

export default AddParticipant;
