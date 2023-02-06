const FeedbackMoodRepository = require("./feedbackMood");

describe("Test saveMoodsForFeedback", () => {

  it("should save moods for feedback", async () => {

    const feedbackMoodRepo = new FeedbackMoodRepository();
    feedbackMoodRepo.dbProvider.addMany = jest.fn().mockReturnValue([10]);
    jest.spyOn(feedbackMoodRepo.dbProvider, 'addMany')

    const moodIds = [2, 3];
    const feedback_id = 1;
    const feedbackMoods = moodIds.map(moodId => ({
      mood_id: moodId,
      feedback_id: feedback_id
    }));
    const result = await feedbackMoodRepo.saveMoodsForFeedback(feedback_id, moodIds);

    expect(feedbackMoodRepo.dbProvider.addMany.mock.calls.length).toBe(1);
    expect(JSON.stringify(feedbackMoodRepo.dbProvider.addMany.mock.calls[0][1])).toBe(JSON.stringify(feedbackMoods));
  });
});