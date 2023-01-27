const { isWeekend, differenceInBusinessDays } = require("date-fns");

const data = [
  {
    id: 1,
    feedback: "I am very happy today because I got code reviews on time!",
    source: "http://github.com",
    created_at: "2022-03-10T03:53:00.000Z",
    day_of_streak: 1,
    average_sentiment: "4.5000000000000000",
    moods: [
      { id: 3, emoji: "😀", emoji_name: "grin", sentiment_value: 5 },
      { id: 2, emoji: "🙂", emoji_name: "smile", sentiment_value: 4 },
    ],
    tags: [
      { id: 3, tag_name: "Feedback" },
      { id: 4, tag_name: "Impactful Work" },
      { id: 1, tag_name: "Mentorship" },
    ],
  },
  {
    id: 4,
    feedback: "Just happy!",
    source: "http://github.com",
    created_at: "2022-03-14T05:32:00.000Z",
    day_of_streak: 3,
    average_sentiment: "3.3333333333333333",
    moods: [
      { id: 13, emoji: "😯", emoji_name: "hushed", sentiment_value: 1 },
      { id: 8, emoji: "😆", emoji_name: "squint", sentiment_value: 4 },
      { id: 9, emoji: "🤩", emoji_name: "starstruck", sentiment_value: 5 },
    ],
    tags: [
      { id: 1, tag_name: "Mentorship" },
      { id: 2, tag_name: "Collaboration" },
      { id: 3, tag_name: "Feedback" },
    ],
  },
  {
    id: 6,
    feedback: "Best day ever!",
    source: "http://github.com",
    created_at: "2022-03-25T12:00:00.000Z",
    day_of_streak: 1,
    average_sentiment: "4.5000000000000000",
    moods: [
      { id: 3, emoji: "😀", emoji_name: "grin", sentiment_value: 5 },
      { id: 2, emoji: "🙂", emoji_name: "smile", sentiment_value: 4 },
    ],
    tags: [
      { id: 3, tag_name: "Feedback" },
      { id: 4, tag_name: "Impactful Work" },
      { id: 1, tag_name: "Mentorship" },
    ],
  },
  {
    id: 7,
    feedback: "hello",
    source: "http://localhost:8080/",
    created_at: "2023-01-24T11:15:05.000Z",
    day_of_streak: 1,
    average_sentiment: "2.0000000000000000",
    moods: [{ id: 4, emoji: "😐", emoji_name: "neutral", sentiment_value: 2 }],
    tags: [
      { id: 1, tag_name: "Mentorship" },
      { id: 2, tag_name: "Collaboration" },
      { id: 3, tag_name: "Feedback" },
      { id: 4, tag_name: "Impactful Work" },
      { id: 5, tag_name: "Kind Words" },
      { id: 6, tag_name: "Learning" },
      { id: 7, tag_name: "Other" },
    ],
  },
  {
    id: 8,
    feedback: "learning",
    source: "http://localhost:8080/",
    created_at: "2023-01-24T11:15:26.000Z",
    day_of_streak: 1,
    average_sentiment: "0.00000000000000000000",
    moods: [{ id: 1, emoji: "😢", emoji_name: "sad", sentiment_value: 0 }],
    tags: [
      { id: 1, tag_name: "Mentorship" },
      { id: 2, tag_name: "Collaboration" },
      { id: 3, tag_name: "Feedback" },
      { id: 4, tag_name: "Impactful Work" },
      { id: 5, tag_name: "Kind Words" },
      { id: 6, tag_name: "Learning" },
      { id: 7, tag_name: "Other" },
    ],
  },
  {
    id: 9,
    feedback: "collabs",
    source: "http://localhost:8080/",
    created_at: "2023-01-24T11:15:47.000Z",
    day_of_streak: 1,
    average_sentiment: "5.0000000000000000",
    moods: [
      { id: 9, emoji: "🤩", emoji_name: "starstruck", sentiment_value: 5 },
    ],
    tags: [
      { id: 1, tag_name: "Mentorship" },
      { id: 2, tag_name: "Collaboration" },
      { id: 3, tag_name: "Feedback" },
      { id: 4, tag_name: "Impactful Work" },
      { id: 5, tag_name: "Kind Words" },
      { id: 6, tag_name: "Learning" },
      { id: 7, tag_name: "Other" },
    ],
  },
  {
    id: 10,
    feedback: "hello",
    source: "http://localhost:8080/",
    created_at: "2023-01-25T10:09:07.000Z",
    day_of_streak: 2,
    average_sentiment: "1.00000000000000000000",
    moods: [
      { id: 12, emoji: "🤯", emoji_name: "mindblown", sentiment_value: 1 },
    ],
    tags: [
      { id: 1, tag_name: "Mentorship" },
      { id: 2, tag_name: "Collaboration" },
      { id: 3, tag_name: "Feedback" },
      { id: 4, tag_name: "Impactful Work" },
      { id: 5, tag_name: "Kind Words" },
      { id: 6, tag_name: "Learning" },
      { id: 7, tag_name: "Other" },
    ],
  },
  {
    id: 2,
    feedback: "Burned out :(",
    source: "http://github.com",
    created_at: "2022-03-10T13:40:00.000Z",
    day_of_streak: 1,
    average_sentiment: "2.5000000000000000",
    moods: [
      { id: 10, emoji: "🥰", emoji_name: "hearts", sentiment_value: 5 },
      { id: 1, emoji: "😢", emoji_name: "sad", sentiment_value: 0 },
    ],
    tags: [],
  },
  {
    id: 5,
    feedback: "Not a great day at all, my internet broke.",
    source: "http://github.com",
    created_at: "2022-03-15T14:48:00.000Z",
    day_of_streak: 4,
    average_sentiment: "2.2500000000000000",
    moods: [
      { id: 5, emoji: "😬", emoji_name: "grimace", sentiment_value: 3 },
      { id: 4, emoji: "😐", emoji_name: "neutral", sentiment_value: 2 },
      { id: 2, emoji: "🙂", emoji_name: "smile", sentiment_value: 4 },
      { id: 1, emoji: "😢", emoji_name: "sad", sentiment_value: 0 },
    ],
    tags: [],
  },
  {
    id: 3,
    feedback: "Just a normal day I guess",
    source: "http://github.com",
    created_at: "2022-03-11T07:50:00.000Z",
    day_of_streak: 2,
    average_sentiment: "4.0000000000000000",
    moods: [{ id: 2, emoji: "🙂", emoji_name: "smile", sentiment_value: 4 }],
    tags: [],
  },
];

const dataForMoods = [];

const feedbackList = [];

const calculateStreak = (url) => {
  let createdAt = new Date(url.split("createdAt=")[1]);
  if (!url.split("createdAt=")[1]) {
    return null;
  }
  let lastfeedBack = data.sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  )[0];
  let diffInBusinessDays = Math.round(
    Math.abs(
      differenceInBusinessDays(
        new Date(lastfeedBack.created_at),
        new Date(createdAt)
      )
    )
  );
  return isWeekend(new Date(createdAt))
    ? lastfeedBack.day_of_streak
    : diffInBusinessDays === 1
    ? lastfeedBack.day_of_streak + 1
    : diffInBusinessDays === 0
    ? lastfeedBack.day_of_streak
    : 1;
};

const getCheckInsByDate = (url) => {
  let currentDate = new Date(url.split("current_date=")[1]);
  if (!url.split("current_date=")[1]) {
    return null;
  }
  return data.filter((item) => {
    let date = currentDate;
    let endDate = new Date(
      new Date(date).setDate(new Date(date).getDate() + 1)
    ).toISOString();
    return item.created_at >= date.toISOString() && item.created_at < endDate;
  });
};

const saveMoods = (listOfMoods) => {
  if (listOfMoods.length === 0) {
    return null;
  }
  let obj = {
    id: Math.floor(1000 + Math.random() * 9000),
    feedback: "I am very happy today because I got code reviews on time!",
    source: "http://github.com",
    created_at: "2022-03-10T03:53:00.000Z",
    day_of_streak: 1,
    average_sentiment: "4.5000000000000000",
    moods: listOfMoods,
    tags: [],
  };
  dataForMoods.push(obj);
  return { feedBackId: obj.id };
};

const getCheckInStatus = () => {
  return {
    isTodaysCheckInsDone:
      data.filter(
        (item) =>
          item.created_at >= new Date().toISOString() &&
          item.created_at <
            new Date(new Date().setDate(new Date().getDate() + 1)).toISOString()
      ).length > 0,
    longestStreak: data.sort((a, b) => b.day_of_streak - a.day_of_streak)[0]
      .day_of_streak,
    currentStreak: data.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    )[0].day_of_streak,
  };
};

const saveFeedback = (feedBackDto) => {
  if (
    !feedBackDto.feedback ||
    !feedBackDto.moods ||
    feedBackDto.moods.length === 0
  ) {
    return false;
  }
  feedBackDto.id = Math.floor(1000 + Math.random() * 9000);
  feedbackList.push(feedBackDto);
  return { feedbackId: feedBackDto.id, feedbackList };
};
module.exports = {
  get: jest.fn((url) => {
    if (url.includes("https://www.mockurl.com/check-ins?current_date=")) {
      return Promise.resolve({
        data: getCheckInsByDate(url) === null ? [] : getCheckInsByDate(url),
        status: getCheckInsByDate(url) === null ? 500 : 200,
      });
    } else if (url.includes("https://www.mockurl.com/streak?createdAt=")) {
      return Promise.resolve({
        data: calculateStreak(url.split("?")[1]),
        status: calculateStreak(url.split("?")[1]) === null ? 500 : 200,
      });
    } else if (url.includes("https://www.mockurl.com/mood?list=")) {
      return Promise.resolve({
        data: url.split("?list")[1],
        status:
          saveMoods(JSON.parse(JSON.stringify(url.split("?list=")[1]))) === null
            ? 500
            : 200,
      });
    } else if (url.includes("https://www.mockurl.com/feedback?id=")) {
      return Promise.resolve({
        data: dataForMoods.filter(
          (item) => item.id === parseInt(url.split("id=")[1])
        )[0],
        status: 200,
      });
    } else if (url.includes("https://www.mockurl.com/check_in_status")) {
      return Promise.resolve({
        data: getCheckInStatus(),
        status: 200,
      });
    } else if (url.includes("https://www.mockurl.com/getFeedback?id=")) {
      return Promise.resolve({
        data: feedbackList,
        status: 200,
      });
    } else {
      throw new Error("Mock Error code 404");
    }
  }),
  post: jest.fn((url, body) => {
    if (url.includes("https://www.mockurl.com/savemoods")) {
      return Promise.resolve({
        data: saveMoods(JSON.parse(body.body)),
        status: saveMoods(JSON.parse(body.body)) === null ? 500 : 200,
      });
    } else if (url.includes("https://www.mockurl.com/feedback")) {
      return Promise.resolve({
        data: saveFeedback(JSON.parse(body.body)),
        status: 200,
      });
    } else {
      throw new Error("Mock Error code 404");
    }
  }),
};
