import React, { useState, useContext, useEffect } from "react";
import QuePanel from "./QuePanel";
import QuestionContent from "./QuestionContent";
import "./Styles/AssignmnetPage1.css";
import { TestData } from "../TestTrackSelect/TestsPage";
import { GetAssignmentsofTest } from "../../Util/assignment";
import { UserContext } from "../../App";

const AssignmentPage = () => {
  const testData = useContext(TestData);
  const userData = useContext(UserContext);

  useEffect(() => {
    GetAssignmentsofTest(testData.currentTestData.testId)
      .then(res => {
        const data = res.data.assignments;
        let a = [];
        data.forEach(async (question, index) => {
          let temp = { ...question };
          temp.id = `v-pills-${index + 1}`;
          temp.name = `${index + 1}`;
          temp.content = question;
          a.push(temp);
        });
        setQuestions(a);
        userData.setisLoading(false);
      })
      .catch(err => {
        userData.setisLoading(false);
      });
  }, [testData.currentTestData.testId]);

  const [Questions, setQuestions] = useState([]);

  const Questions1 = Questions[0];
  try {
    var questionContents = Questions.map((q, index) => {
      if (index === 0) {
        return null;
      } else {
        return (
          <>
            <QuestionContent content={q.content} id={q.id} key={index} />
          </>
        );
      }
    });
  } catch (error) {}

  return (
    <div className="assignment-list">
      {Questions.length > 0 ? (
        <>
          <div className="tab-panel">
            <div className="row">
              <div className="col-md-1">
                <div className="que-no">
                  <QuePanel QueNo={Questions} />
                </div>
              </div>

              <div className="col-md-11">
                <div className="tab-content" id="v-pills-tabContent">
                  <>
                    <QuestionContent
                      content={Questions1.content}
                      id={Questions1.id}
                      active={true}
                    />

                    {questionContents}
                  </>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        "No Questions to Display"
      )}
    </div>
  );
};

export default AssignmentPage;
