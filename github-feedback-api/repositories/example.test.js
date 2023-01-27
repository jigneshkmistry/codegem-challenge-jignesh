const {
  getCheckInsByDate,
  saveFeedbackStreak,
  saveMoods,
  getMoodByFeedbackById,
  getCheckInStatus,
  saveFeedback,
  getFeedBackById
} = require("../mockApi");
const url = "https://www.mockurl.com/check-ins";
const urlFeedbackStreak = "https://www.mockurl.com/streak";
const saveMoodUrl = "https://www.mockurl.com/savemoods";
const checkInStatusUrl = "https://www.mockurl.com/check_in_status";
const feedBackUrl = "https://www.mockurl.com/feedback";
const getFeedBackByIdUrl = "https://www.mockurl.com/getFeedback?id=";
describe("Test check-ins on selected date", () => {
  it("should return a List of check-ins with current_date", (done) => {
    getCheckInsByDate(url, "?current_date=2023-01-23T18:30:00.000Z").then(
      (result) => {
        const { data, status } = result;
        expect(status).toBe(200);
        expect(data.length).toBeGreaterThan(0);
        expect(data.length).toBeGreaterThanOrEqual(3);
        done();
      }
    );
  });
  it("should return a List of check-ins empty if there is no check-ins for current_date", (done) => {
    getCheckInsByDate(url, "?current_date=2023-01-20T18:30:00.000Z").then(
      (result) => {
        const { data, status } = result;
        expect(status).toBe(200);
        expect(data.length).toBe(0);
        done();
      }
    );
  });
  it("should return a error if current_date is empty", (done) => {
    getCheckInsByDate(url, "?current_date=").then((result) => {
      const { data, status } = result;
      expect(status).toBe(500);
      expect(data.length).toBe(0);
      done();
    });
  });
});

describe("Test streak on feedback", () => {
  it("should return a streak equal to (streak of previous created feedback) + 1 because difference between created date of last feedback and current feedback is equal to 1", (done) => {
    saveFeedbackStreak(urlFeedbackStreak, "?createdAt=2023-01-26T07:52:30.096Z").then(
      (result) => {
        const { data, status } = result;
        expect(status).toBe(200);
        expect(data).toBe(3);
        done();
      }
    );
  });
  it("should return a streak equal to streak of previous created feedback because created date falls on weekend", (done) => {
    saveFeedbackStreak(urlFeedbackStreak, "?createdAt=2023-01-28T00:00:00.000Z").then(
      (result) => {
        const { data, status } = result;
        expect(status).toBe(200);
        expect(data).toBe(2);
        done();
      }
    );
  });
  it("should return a streak equal to streak of previous created feedback because difference between created date of last feedback and current feedback is equal to 0", (done) => {
    saveFeedbackStreak(urlFeedbackStreak, "?createdAt=2023-01-28T00:00:00.000Z").then(
      (result) => {
        const { data, status } = result;
        expect(status).toBe(200);
        expect(data).toBe(2);
        done();
      }
    );
  });
  it("should return a streak equal to 1 because difference between created date of last feedback and current feedback is greater than 1 and created date of current feedback doesn't comes on weekend.", (done) => {
    saveFeedbackStreak(urlFeedbackStreak, "?createdAt=2023-01-31T00:00:00.000Z").then(
      (result) => {
        const { data, status } = result;
        expect(status).toBe(200);
        expect(data).toBe(1);
        done();
      }
    );
  });
  it("should return an error if createdAt is empty.", (done) => {
    saveFeedbackStreak(urlFeedbackStreak, "?createdAt=").then((result) => {
      const { data, status } = result;
      expect(status).toBe(500);
      expect(data).toBe(null);
      done();
    });
  });
});

describe("Test moods on feedback", () => {
  it("should return a feedback with length of mood is equal to 4", (done) => {
    const moods = [
      { id: 5, emoji: "😬", emoji_name: "grimace", sentiment_value: 3 },
      { id: 4, emoji: "😐", emoji_name: "neutral", sentiment_value: 2 },
      { id: 2, emoji: "🙂", emoji_name: "smile", sentiment_value: 4 },
      { id: 1, emoji: "😢", emoji_name: "sad", sentiment_value: 0 },
    ];
    expect(Array.isArray(moods)).toBe(true);
    saveMoods(saveMoodUrl, moods).then((result) => {
      const { data, status } = result;
      const { feedBackId } = data;
      expect(status).toBe(200);
      getMoodByFeedbackById(feedBackUrl, `?id=${feedBackId}`).then((res) => {
        const { data, status } = res;
        expect(status).toBe(200);
        expect(data.moods.length).toBe(4);
        done();
      });
    });
  });
  it("should return an error with empty body", (done) => {
    const moods = [];
    saveMoods(saveMoodUrl, moods).then((result) => {
      const { status } = result;
      expect(status).toBe(500);
      done();
    });
  });
});

describe("Test check-in status api", () => {
  it("should return a check in status where today's check in status should false, longest streak should be 4, current streak should be 3", (done) => {
      getCheckInStatus(checkInStatusUrl).then(
        (res) => {
          const { data, status } = res;
          expect(status).toBe(200);
          expect(typeof data.isTodaysCheckInsDone).toBe("boolean");
          expect(typeof data.longestStreak).toBe("number");
          expect(typeof data.currentStreak).toBe("number");
          expect(data.isTodaysCheckInsDone).toBe(false);
          expect(data.longestStreak).toBe(4);
          expect(data.currentStreak).toBe(2);
          done();
        }
      ) ;
  });
});

describe("Test feedback api", () => {
  it("should return a check in status where today's check in status should false, longest streak should be 4, current streak should be 3", (done) => {
    let feedBackDto = {
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
  };
  expect(typeof feedBackDto.id).toBe("number");
  expect(typeof feedBackDto.feedback).toBe("string");
  expect(typeof feedBackDto.source).toBe("string");
  expect(typeof feedBackDto.created_at).toBe("string");
  expect(typeof feedBackDto.day_of_streak).toBe("number");
  expect(typeof feedBackDto.average_sentiment).toBe("string");
  expect(Array.isArray(feedBackDto.moods)).toBe(true);
  expect(Array.isArray(feedBackDto.tags)).toBe(true);
  done();
  saveFeedback(feedBackUrl, feedBackDto).then((result)=> {
    const { data, status } = result;
    const { feedbackId, feedbackList } = data;
    console.log(feedbackList);
    expect(status).toBe(200);
    expect(typeof feedbackId).toBe("number");
    getFeedBackById(getFeedBackByIdUrl, `?id=${feedbackId}`).then((res)=> {
      const { data, status } = res;
      console.log(feedbackId, data);
      expect(status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBe(1);
      done();
    });

  });
  });
});
