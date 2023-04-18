import axios from "axios";

export const testLeaderBoard = async (testId) => {
  return await axios.get(`/result/${testId}`);
};

export const getResultsofTest = async (testId) => {
  return await axios.get(`/overallresult/${testId}`);
};
