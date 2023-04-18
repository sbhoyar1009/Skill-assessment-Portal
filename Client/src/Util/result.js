import axios from "axios";

export const getResultOfAssignment = async (testId, assignmentID, username) => {
  return await axios.get(`/result/${testId}/${username}/${assignmentID}`);
};
