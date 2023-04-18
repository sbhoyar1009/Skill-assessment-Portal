import axios from "axios";

//get all tests for admin home page
export const getAllTests = async () => {
  return await axios.get("/api/getTests");
};

export const getAllCompetencies = async () => {
  return await axios.get("/api/competency");
};

export const getSubCompetencies = async (competency) => {
  return await axios.get(`/api/subcompetency/${competency}`);
};

export const getTestCarddata = async (testId) => {
  return await axios.get(`/api/gettest/${testId}`);
};

export const setTestActive = async (test) => {
  return await axios.post(`/api/setActive/${test._id}`, test);
};

export const setTestInActive = async (test) => {
  return await axios.post(`/api/setInActive/${test._id}`, test);
};

//get test of user
export const getTestsOfUser = async (id) => {
  //return await axios.get(`/getTests/${id}`);
  return await axios.get(`/api/getTestsofUser/${id}`);
};

export const getTestByID = async (_id) => {
  return await axios.get(`/api/gettest/${_id}`);
};

export const TestPresent = async (title) => {
  return axios.post("/api/checktest", {
    testName: title,
  });
};

export const addTestToDataBase = async (test) => {
  return axios.post("/api/createTest", { test });
};

export const isTestActive = async (testId) => {
  return axios.post("/api/istestactive", { testId });
};

export const addParticipantsToTest = async (participants, testId) => {
  return axios.post(`/api/test/addparticipants/${testId}`, { participants });
};

export const deleteParticipantOfTest = async (testId, username) => {
  return axios.post(`/api/deleteparticipant/${testId}/${username}`);
};

export const CheckForks = async (testId, username) => {
  return axios.post(`/api/createforks/${testId}/${username}`);
};

export const CheckForksForAllUsers = async (testId) => {
  return axios.post(`/api/createforksforallusers/${testId}`);
};

export const updateDetails = async (data, testId) => {
  return axios.put(`/api/update/${testId}`, { data });
};

export const getCourse = async () => {
  // return axios.get("https://eduonline.kpit.com/api/courses/v1/courses/?org=NOVA");
  return axios.get("/getcoursesofnova");
};
