import React from "react";
import { Modal, ModalManager, Effect } from "react-dynamic-modal";
import { GrClose } from "react-icons/gr";
import { BsDownload } from "react-icons/bs";
import jsPDF from "jspdf";
import "jspdf-autotable";

const doc = new jsPDF();

const CustomModal = (props) => {
  const { data, title, username, index, onRequestClose, testName } = props;
  console.log(data);
  const downLoadpdf = () => {
    let pdfData = [];
    pdfData = [...pdfData, ["Test", testName]];
    pdfData = [...pdfData, ["Assignment", title]];
    pdfData = [...pdfData, ["username", username]];
    if (
      data.assignmentResult.cloc &&
      data.assignmentResult.cloc.numberOfFiles
    ) {
      pdfData = [
        ...pdfData,
        ["Files Analysed", data.assignmentResult.cloc.numberOfFiles],
      ];
    }
    if (data.assignmentResult.cloc && data.assignmentResult.cloc.lineOfCode) {
      pdfData = [
        ...pdfData,
        ["Total LOC", data.assignmentResult.cloc.lineOfCode],
      ];
    }
    if (data.assignmentResult.cloc && data.assignmentResult.cloc.per_comment) {
      pdfData = [
        ...pdfData,
        ["Percent Comments", data.assignmentResult.cloc.per_comment + "%"],
      ];
    }

    if (
      data.assignmentResult.lizard &&
      data.assignmentResult.lizard.summary &&
      data.assignmentResult.lizard.summary.functionsAboveThreshold
    ) {
      pdfData = [
        ...pdfData,
        [
          "Functions With Complexity Above Threshold",
          data.assignmentResult.lizard.summary.functionsAboveThreshold,
        ],
      ];
    }

    if (
      data.assignmentResult.lizard &&
      data.assignmentResult.lizard.summary &&
      data.assignmentResult.lizard.summary.maxComplexFunction
    ) {
      pdfData = [
        ...pdfData,
        [
          "Most Complex Function",
          data.assignmentResult.lizard.summary.maxComplexFunction,
        ],
      ];
    }
    if (
      data.assignmentResult.lizard &&
      data.assignmentResult.lizard.summary &&
      data.assignmentResult.lizard.summary.maxComplexity
    ) {
      pdfData = [
        ...pdfData,
        [
          "Complexity Of Most Complex Function",
          data.assignmentResult.lizard.summary.maxComplexity,
        ],
      ];
    }

    pdfData = [...pdfData, ["Recent Score", data.recentScore]];
    pdfData = [...pdfData, ["Number of Attempts", data.attemptNumber]];
    pdfData = [...pdfData, ["Last updated", data.lastUpdated]];

    doc.autoTable({
      head: [["Attribute", "Value"]],
      body: pdfData,
    });

    doc.save(
      `${testName}-${title}-${username}-${
        new Date().toISOString().split("T")[0]
      }`
    );

    pdfData = [];
  };

  return (
    <Modal onRequestClose={onRequestClose} effect={Effect.ScaleUp}>
      <div className="container">
        <button onClick={ModalManager.close} className="modal-close-btn">
          <GrClose size={12} style={{ marginBottom: "1px" }} />
        </button>
        <button onClick={downLoadpdf} className="modal-close-btn">
          <BsDownload size={15} style={{ marginBottom: "1px" }} />
        </button>
      </div>

      <div className="container modal-container">
        <div className="row" style={{ textAlign: "center" }}>
          <div className="col">
            <h6>
              {username}-{title}
            </h6>
          </div>
        </div>
        {/* <div style={{textAlign:'center'}}>
            <h3>{title}</h3>
        </div> */}
        <div
          style={{
            margin: "10px",
            fontFamily: "Work Sans, sans-serif",
            fontSize: "13px",
            fontWeight: "400",
            lineHeight: "1.5",
            color: "#212529",
            textAlign: "center",
            backgroundColor: "#fff",
            padding: "1rem",
          }}
        >
          {/* <h6
              style={{
                marginTop: "0",
                marginBottom: "3px",
                fontWeight: "500",
                lineHeight: "1.2",
                fontSize: "13px",
              }}
            >
              Auto Evaluation Summary of Recent Commit
            </h6> */}
          {/* <h6
              style={{
                marginTop: "0",
                marginBottom: "3px",
                fontWeight: "500",
                lineHeight: "1.2",
                fontSize: "13px",
              }}
            >
              Auto Evaluation Summary For Repository{" "}
              <a
                style={{
                  color: "#622ADB",
                  textDecoration: "none",
                  backgroundColor: "transparent",
                }}
                href="https://gitlab.kpit.com/ebdtrack/cipdtest/userstestgroups-dummy/testingonserver-gauravr3/assignment-6"
              >
                {data.assignmentdata.cloc.jobUrl}
              </a>{" "}
              | Branch/Tag{" "}
              <a
                style={{
                  color: "#622ADB",
                  textDecoration: "none",
                  backgroundColor: "transparent",
                }}
                href="https://gitlab.kpit.com/ebdtrack/cipdtest/userstestgroups-dummy/testingonserver-gauravr3/assignment-6/tree/{branch}"
              >
                master
              </a>
            </h6> */}
          {/* <hr
              style={{
                height: "1px",
                color: "#cfd5db",
                backgroundColor: "#cfd5db",
                border: "none",
                padding: "0 0 0 0",
                margin: "0 0 0 0",
              }}
            /> */}

          <table
            align="center"
            style={{
              fontFamily: "Work Sans, sans-serif",
              fontSize: "13px",
              borderCollapse: "collapse",
              width: "auto",
              marginTop: "12px",
              marginBottom: "12px",
              color: "#212529",
              border: "1px solid #cfd5db",
            }}
          >
            {/* <tr>
                <td
                  style={{
                    textAlign: "left",
                    padding: "10px",
                    verticalAlign: "middle",
                    border: "1px solid #cfd5db",
                  }}
                >
                  GitLab CI Pipeline:
                </td>
                <td
                  style={{
                    textAlign: "left",
                    padding: "10px",
                    verticalAlign: "middle",
                    border: "1px solid #cfd5db",
                  }}
                >
                  <a
                    style={{
                      color: "#622ADB",
                      textDecoration: "none",
                      backgroundColor: "transparent",
                    }}
                    href="https://gitlab.kpit.com/ebdtrack/cipdtest/userstestgroups-dummy/testingonserver-gauravr3/assignment-6/-/pipelines/386423"
                  >
                    #386423
                  </a>
                </td>
              </tr> */}
            {/* <tr>
                <td
                  style={{
                    textAlign: "left",
                    padding: "10px",
                    verticalAlign: "middle",
                    border: "1px solid #cfd5db",
                  }}
                >
                  Trigger Source
                </td>
                <td
                  style={{
                    textAlign: "left",
                    padding: "10px",
                    verticalAlign: "middle",
                    border: "1px solid #cfd5db",
                  }}
                >
                  push
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    textAlign: "left",
                    padding: "10px",
                    verticalAlign: "middle",
                    border: "1px solid #cfd5db",
                  }}
                >
                  Triggered By
                </td>
                <td
                  style={{
                    textAlign: "left",
                    padding: "10px",
                    verticalAlign: "middle",
                    border: "1px solid #cfd5db",
                  }}
                >
                  <a
                    style={{
                      color: "#622ADB",
                      textDecoration: "none",
                      backgroundColor: "transparent",
                    }}
                    href="http://gitlab.kpit.com/gauravr3"
                  >
                    Gaurav Rasal
                  </a>
                </td>
              </tr> */}

            <tr>
              <td
                style={{
                  textAlign: "left",
                  padding: "10px",
                  verticalAlign: "middle",
                  border: "1px solid #cfd5db",
                }}
              >
                Files Analysed
              </td>
              <td
                style={{
                  textAlign: "left",
                  padding: "10px",
                  verticalAlign: "middle",
                  border: "1px solid #cfd5db",
                }}
              >
                {data.assignmentResult.cloc &&
                data.assignmentResult.cloc.numberOfFiles
                  ? data.assignmentResult.cloc.numberOfFiles
                  : "NA"}
              </td>
            </tr>
            <tr>
              <td
                style={{
                  textAlign: "left",
                  padding: "10px",
                  verticalAlign: "middle",
                  border: "1px solid #cfd5db",
                }}
              >
                Total LOC
              </td>
              <td
                style={{
                  textAlign: "left",
                  padding: "10px",
                  verticalAlign: "middle",
                  border: "1px solid #cfd5db",
                }}
              >
                {data.assignmentResult.cloc &&
                data.assignmentResult.cloc.lineOfCode
                  ? data.assignmentResult.cloc.lineOfCode
                  : "NA"}
              </td>
            </tr>
            <tr>
              <td
                style={{
                  textAlign: "left",
                  padding: "10px",
                  verticalAlign: "middle",
                  border: "1px solid #cfd5db",
                }}
              >
                Percent Comments
              </td>
              <td
                style={{
                  textAlign: "left",
                  padding: "10px",
                  verticalAlign: "middle",
                  border: "1px solid #cfd5db",
                }}
                data-toggle="tooltip"
                data-placement="bottom"
              >
                {data.assignmentResult.cloc &&
                data.assignmentResult.cloc.per_comment
                  ? data.assignmentResult.cloc.per_comment + "%"
                  : "NA"}
              </td>
            </tr>

            <tr>
              <td
                style={{
                  textAlign: "left",
                  padding: "10px",
                  verticalAlign: "middle",
                  border: "1px solid #cfd5db",
                }}
              >
                Percent Duplication
              </td>
              <td
                style={{
                  textAlign: "left",
                  padding: "10px",
                  verticalAlign: "middle",
                  border: "1px solid #cfd5db",
                }}
                data-toggle="tooltip"
                data-placement="bottom"
              >
                {data.assignmentResult.cpd &&
                data.assignmentResult.cpd.summary.duplication
                  ? data.assignmentResult.cpd.summary.duplication + "%"
                  : "NA"}
              </td>
            </tr>

            <tr>
              <td
                style={{
                  textAlign: "left",
                  padding: "10px",
                  verticalAlign: "middle",
                  border: "1px solid #cfd5db",
                }}
              >
                Functions With Complexity Above Threshold
              </td>
              <td
                style={{
                  textAlign: "left",
                  padding: "10px",
                  verticalAlign: "middle",
                  border: "1px solid #cfd5db",
                }}
                data-toggle="tooltip"
                data-placement="bottom"
              >
                {data.assignmentResult.lizard &&
                data.assignmentResult.lizard.summary &&
                data.assignmentResult.lizard.summary.functionsAboveThreshold
                  ? data.assignmentResult.lizard.summary.functionsAboveThreshold
                  : "NA"}
              </td>
            </tr>
            <tr>
              <td
                style={{
                  textAlign: "left",
                  padding: "10px",
                  verticalAlign: "middle",
                  border: "1px solid #cfd5db",
                }}
              >
                Most Complex Function
              </td>
              <td
                style={{
                  textAlign: "left",
                  padding: "10px",
                  verticalAlign: "middle",
                  border: "1px solid #cfd5db",
                }}
              >
                {data.assignmentResult.lizard &&
                data.assignmentResult.lizard.summary &&
                data.assignmentResult.lizard.summary.maxComplexFunction
                  ? data.assignmentResult.lizard.summary.maxComplexFunction
                  : "NA"}
              </td>
            </tr>
            <tr>
              <td
                style={{
                  textAlign: "left",
                  padding: "10px",
                  verticalAlign: "middle",
                  border: "1px solid #cfd5db",
                }}
              >
                Complexity Of Most Complex Function
              </td>
              <td
                style={{
                  textAlign: "left",
                  padding: "10px",
                  verticalAlign: "middle",
                  border: "1px solid #cfd5db",
                }}
                data-toggle="tooltip"
                data-placement="bottom"
              >
                {data.assignmentResult.lizard &&
                data.assignmentResult.lizard.summary &&
                data.assignmentResult.lizard.summary.maxComplexity
                  ? data.assignmentResult.lizard.summary.maxComplexity
                  : "NA"}
              </td>
            </tr>

            <tr>
              <td
                style={{
                  textAlign: "left",
                  padding: "10px",
                  verticalAlign: "middle",
                  border: "1px solid #cfd5db",
                }}
              >
                Recent Score
              </td>
              <td
                style={{
                  textAlign: "left",
                  padding: "10px",
                  verticalAlign: "middle",
                  border: "1px solid #cfd5db",
                }}
                data-toggle="tooltip"
                data-placement="bottom"
              >
                {data.recentScore ? data.recentScore : "NA"}
              </td>
            </tr>
            <tr>
              <td
                style={{
                  textAlign: "left",
                  padding: "10px",
                  verticalAlign: "middle",
                  border: "1px solid #cfd5db",
                }}
              >
                Number of Attempts
              </td>
              <td
                style={{
                  textAlign: "left",
                  padding: "10px",
                  verticalAlign: "middle",
                  border: "1px solid #cfd5db",
                }}
                data-toggle="tooltip"
                data-placement="bottom"
              >
                {data.attemptNumber ? data.attemptNumber : "NA"}
              </td>
            </tr>
            <tr>
              <td
                style={{
                  textAlign: "left",
                  padding: "10px",
                  verticalAlign: "middle",
                  border: "1px solid #cfd5db",
                }}
              >
                Last updated
              </td>
              <td
                style={{
                  textAlign: "left",
                  padding: "10px",
                  verticalAlign: "middle",
                  border: "1px solid #cfd5db",
                }}
                data-toggle="tooltip"
                data-placement="bottom"
              >
                {data.lastUpdated ? data.lastUpdated : "NA"}
              </td>
            </tr>
          </table>
        </div>
      </div>
    </Modal>
  );
};

export default CustomModal;
