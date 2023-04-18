import axios from "axios";

//check if assignment is already present
export const checkAssignment = async (title) => {
  return axios.post("/api/checkassignment", {
    assignmentName: title,
  });
};

//get test of assignments
export const GetAssignmentsofTest = async (testId) => {
  return await axios.get(`/api/getAssignmentsofTest/${testId}`);
};
//get all of assignments
// export const GetAllAssignments = async (competency, subCompetency) => {
//   return await axios.get(`/api/assignments/${competency}/${subCompetency}`);
// };
export const GetAllAssignments = async (competency) => {
  return await axios.get(`/api/assignments/${competency}`);
};



//get assignment list
export const GetAssignmentList = async () => {
  return await axios.get(`/api/assignments`);
};

//get all of assignments Groups of gitlab
export const GetAllAssignmentsofGitlab = async () => {
  return await axios.get(`/api/getAssignmentsGroupsOfGitlab`);
};

//add assign to db
export const AddAssignment = async (assignment) => {
  return await axios.post("/api/assignment", assignment);
};
//delete assign from db and gitlab
export const DeleteAssignment = async (assignment) => {
  return await axios.post("/api/deleteassignment", assignment);
};

//delete assign from Test
export const DeleteAssignmentfromTest = async (testId, assignmentID) => {
  return await axios.post(`/api/deleteassignment/${testId}/${assignmentID}`);
};

export const DeleteAssignmentsfromTest = async (testId, assignmentIDs) => {
  return await axios({
    method: "post",
    url: `/api/deleteassignments/${testId}`,
    withCredentials: true,
    crossdomain: true,
    data: assignmentIDs,
  });
};

export const changePDF = async (PDF) => {
  return await axios.post("/changePDF", PDF);
};

export const addAssignmentToExistingTest = async (Data) => {
  return await axios.post(`/api/addAssignments/test/${Data.testId}`, Data);
};

export const getAllSubCompetencies = async (assignment) => {
  return await axios.get(`/api/allSubCompetencies/${assignment}`);
};

