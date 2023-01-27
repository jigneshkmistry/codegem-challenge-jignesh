const axios = require("axios");

const getCheckInsByDate = async (url, currentDate) => {
  const result = await axios.get(`${url}${currentDate}`);
  return result;
};

const saveFeedbackStreak = async (url, createdAt) => {
  const result = await axios.get(`${url}${createdAt}`);
  return result;
};


const getMoodByFeedbackById = async (url, id) => {
  const result = await axios.get(`${url}${id}`);
  return result;
};

const saveMoods = async (url, list) => {
  const result = await axios.post(`${url}`, {
    body: JSON.stringify(list)
  });
  return result;
}; 

const getCheckInStatus = async (url) => {
  const result = await axios.get(`${url}`);
  return result;
};

const saveFeedback = async (url, feedbackDto) => {
  const result = await axios.post(`${url}`, {
    body: JSON.stringify(feedbackDto),
  });
  return result;
};

const getFeedBackById = async (url, id) => {
  const result = await axios.get(`${url}${id}`);
  return result;
};

module.exports = {
  getCheckInsByDate,
  saveFeedback,
  getMoodByFeedbackById,
  saveMoods,
  getCheckInStatus,
  saveFeedbackStreak,
  getFeedBackById,
};
