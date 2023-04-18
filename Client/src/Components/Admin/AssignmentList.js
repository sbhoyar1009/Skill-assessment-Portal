import React, { useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import { GetAssignmentList, DeleteAssignment } from "../../Util/assignment";
import { ModalManager } from "react-dynamic-modal";
// import { MdPictureAsPdf } from "react-icons/md";
import { FiRefreshCcw } from "react-icons/fi";
// import { Document, Page, pdfjs } from "react-pdf";
// import {cpptesting} from "../../../../uploads/cpp-testing.pdf";
// import { AiFillFile } from "react-icons/ai";
// import { MdDelete } from "react-icons/md";
import PDFModal from "./PDFModal";
import { UserContext } from "./../../App";

const columns = [
  { id: "no", label: "Sr. No", minWidth: 60, align: "center" },
  { id: "name", label: "Name", minWidth: 170 },

  { id: "competency", label: "Competency", minWidth: 50 },
  { id: "subcompetency", label: "Sub-competency", minWidth: 50 },
  {
    id: "gitgroupid",
    label: "Gitlab Group ID",
    minWidth: 100,
    align: "center",
  },
  { id: "file", label: "File", minWidth: 10 },
  // {
  //   id: "action",
  //   label: "Action",
  //   minWidth: 170,
  //   align: "center",
  //   // format: (value) => value.toLocaleString("en-US"),
  // },
];

function createData(no, name, competency, file, subcompetency, gitgroupid) {
  return { no: no + ".", name, competency, file, subcompetency, gitgroupid };
}
// function createData(no, name, gitgroupid, action) {
//   return { no: no + ".", name, gitgroupid, action };
// }

// const rows = [];

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: 450,
  },
});

export default function StickyHeadTable() {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [assignments, setAssignments] = React.useState([]);
  const data = useContext(UserContext);
  const rows = [];
  let getAssignments = async () => {
    data.setisLoading(true);
    // console.log("Hitted!");
    GetAssignmentList()
      .then((res) => {
        console.log(res.data)
        setAssignments(res.data);
        data.setisLoading(false);
      })
      .catch((err) => {
        console.log(err);
        data.setisLoading(false);
      });
  };

  useEffect(() => {
    getAssignments();
  }, []);

  const openModal = (assign, i) => {
    ModalManager.open(
      <PDFModal assignment={assign} index={i} onRequestClose={() => true} />
    );
  };

  // const deleteAssignment = (assignmentIndex) => {
  //   let assignmentData = assignments[assignmentIndex];
  //   console.log(assignmentData);
  //   DeleteAssignment(assignmentData)
  //     .then((res) => {
  //       if (res.data.status == "success") {
  //         //user.handleAlert("success", res.data.msg);
  //         alert(res.data.msg);
  //         getAssignments();
  //       } else {
  //         alert(res.data.msg);
  //         // user.handleAlert("error", res.data.msg);
  //       }
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       // user.handleAlert("error", "Something went wrong");
  //     });
  // };

  if (assignments && assignments.length > 0) {
    // console.log(assignments);
    assignments.map((assign, index) => {
      // console.log(assign.subCompetencies.toString())

      return rows.push(
        createData(
          index + 1,
          assign.title,
          assign.Competency,
          <>
            <button
              type="button"
              class="btn btn-primary view-pdf-btn"
              data-toggle="modal"
              data-target="#exampleModalLong"
              onClick={() => {
                openModal(assign, index);
              }}
            >
              View
            </button>
          </>,
          assign.subCompetencies.toString(),
          assign.gitlabGroupId
          // <MdDelete
          //   style={{ color: "red", fontSize: "20px", cursor: "pointer" }}
          // />
        )
      );
    });
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <>
      <div
        style={{ textAlign: "right", cursor: "pointer", marginBottom: "2rem" }}
      >
        <span
          className="btn-refresh"
          onClick={() => {
            getAssignments();
            // document
            //   .getElementsByClassName("search-field-on-admin-side")[0]
            //   .getElementsByTagName("input")[0].value = null;
          }}
        >
          Reload Assignments
          <FiRefreshCcw style={{ marginLeft: 10 }} />
        </span>
      </div>
      <Paper className={classes.root}>
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column, i) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth, fontWeight: "bold" }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, rowIndex) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.code}
                    >
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <>
                            {column.id === "action" ? (
                              <TableCell
                                key={column.id}
                                align={column.align}
                                onClick={() => {
                                  // deleteAssignment(rowIndex);
                                }}
                              >
                                {column.format && typeof value === "number"
                                  ? column.format(value)
                                  : value}
                              </TableCell>
                            ) : (
                              <TableCell key={column.id} align={column.align}>
                                {column.format && typeof value === "number"
                                  ? column.format(value)
                                  : value}
                              </TableCell>
                            )}
                          </>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  );
}
