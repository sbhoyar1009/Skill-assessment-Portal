import React, { useState, useContext } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { changePDF } from "../../Util/assignment";
import { UserContext } from "./../../App";

export default function PDFModal(props) {
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
  let [pages, setpages] = useState(0);
  let [PDF, setPDF] = useState({});
  const file = `/uploads/${props.assignment.title}.pdf`;
  console.log(file);
  const userData = useContext(UserContext);
  const newPDF = () => {
    console.log("new PDF is called")
    // userData.setisLoading(true);
    var formData = new FormData();
    // if (!PDF) {
    //   userData.handleAlert("warning", `Please select a file`);
    //   userData.setisLoading(false);
    //   return;
    // }
    if (PDF) {
      formData.append("pdf", PDF);
      formData.append("file", true);
    }
    formData.append("title", props.assignment.title);
    console.log(formData)
    changePDF(formData)
      .then((res) => {
        if (res.data.status === "success") {
          document.getElementsByName("pdf-upload")[0].value = "";

          setPDF({});
          // userData.setisLoading(false);
          //   window.location.reload();
          userData.handleAlert("success", `PDF updated successfully`);
        } else {
          userData.setisLoading(false);
          console.log("error:", res);
          userData.handleAlert("error", `${res.data.status}`);
        }
      })
      .catch((err) => {
        console.error(err);
        userData.setisLoading(false);
        userData.handleAlert("error", `Error in updating PDF`);
      });
    userData.setisLoading(false);
  };

  const handlePdf = (e) => {
    console.log("Handle PDF called")
    const filename = e.target.files[0].name;
    const fileExtension = filename.split(".").pop();
    console.log(fileExtension)
    if (fileExtension !== "pdf") {
      e.target.value = null;
      userData.handleAlert("error", "Please upload .pdf file");
    } else {
      if (e.target.files[0].size / 1024 > 1024) {
        e.target.value = null;
        userData.handleAlert("error", "File size exceeded");
      } else {
        setPDF(e.target.files[0]);
      }
    }
  };

  const noPDF = () => {
    return <div className="">No PDF available</div>;
  };
  return (
    <div class="modal" tabindex="-1" role="dialog" id="exampleModalLong">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{props.assignment.title}</h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body" style={{ width: "100%", marginLeft: "10px" }}>
            <form
              onSubmit={(e) => {
                newPDF();
                // userData.setisLoading(true);
                // e.preventDefault();

                
              }}
            >
              <input
                type="file"
                name="pdf-upload"
                onChange={(e) => {
                  handlePdf(e);
                }}
                //   required={true}
                accept="application/pdf"
              ></input>
              <label> &nbsp; &nbsp; &nbsp;</label>
              <button class="btn btn-primary pdf-btn" type="submit">
                {" "}
                Change PDF{" "}
              </button>

              <br />
              <small style={{ color: "red" }}>
                {" "}
                Note*: After changing the pdf you must refresh once to see the
                updated pdf file{" "}
              </small>
              <hr />
            </form>
            <div class="d-flex justify-content-center">
              <Document
                className="pdf-container"
                file={file}
                error={noPDF}
                onLoadSuccess={({ numPages }) => {
                  setpages(numPages);
                }}
                onContextMenu={(e) => e.preventDefault()}
              >
                {Array.apply(null, Array(pages))
                  .map((x, i) => i + 1)
                  .map((page) => (
                    <>
                      <Page wrap pageNumber={page} scale={1} />
                      <div
                        style={{
                          textAlign: "center",
                          marginBottom: 10,
                          backgroundColor: "white",
                        }}
                      >
                        {page}
                      </div>
                    </>
                  ))}
              </Document>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
