const FeedbackModel = require("../models/feedback");
const FeedbackRepository = require("./feedback");
const util = require('util');
const { differenceInBusinessDays, nextFriday, differenceInDays, differenceInCalendarDays, isWeekend } = require("date-fns");

describe("Test getTodaysCheckInsCount", () => {

  it("should return a today's checkin count", async () => {

    const feedbackRepository = new FeedbackRepository();
    FeedbackModel.query = jest.fn().mockReturnThis();
    FeedbackModel.where = jest.fn().mockReturnThis();
    FeedbackModel.resultSize = jest.fn().mockReturnValue(3);
    jest.spyOn(FeedbackModel,'where')
    
    const result = await feedbackRepository.getTodaysCheckInsCount();
    // console.log("Arg 1 : " +  JSON.stringify(FeedbackModel.where.mock.calls[0][0]));
    // console.log("Arg 2 : " +  JSON.stringify(FeedbackModel.where.mock.calls[0][1]));
    // console.log("Arg 3 : " +  util.inspect(FeedbackModel.where.mock.calls[0][2].sql));
    
    // console.log("Arg 1 : " +  JSON.stringify(FeedbackModel.where.mock.calls[1][0]));
    // console.log("Arg 2 : " +  JSON.stringify(FeedbackModel.where.mock.calls[1][1]));

    expect(result).toBe(3);
    expect(FeedbackModel.where.mock.calls.length).toBe(2);
  });
});


describe("Test saveFeedback", () => {

  it("should start a new streak when there are no feeback present", async () => {

    const feedbackRepository = new FeedbackRepository();
    feedbackRepository.dbProvider.query = jest.fn().mockReturnThis();
    feedbackRepository.dbProvider.orderBy = jest.fn().mockReturnThis();
    feedbackRepository.dbProvider.first = jest.fn().mockReturnValue(undefined);
    feedbackRepository.dbProvider.add = jest.fn().mockReturnValue([10]);
    jest.spyOn(feedbackRepository.dbProvider,'add')
    const feedBack = {
      source: 'http://github.com',
      feedback: 'Burned out',
      createdAt: new Date()
    }

    const result = await feedbackRepository.saveFeedback(feedBack);

    expect(result).toBe(10);
    expect(feedbackRepository.dbProvider.add.mock.calls[0][1].day_of_streak).toBe(1);
    console.log("Arg 1 : " +  JSON.stringify(feedbackRepository.dbProvider.add.mock.calls[0][1]));
  });

  it("should use last feedback's streak for new feedback on same day", async () => {

    const feedbackRepository = new FeedbackRepository();
    feedbackRepository.dbProvider.query = jest.fn().mockReturnThis();
    feedbackRepository.dbProvider.orderBy = jest.fn().mockReturnThis();
    feedbackRepository.dbProvider.first = jest.fn().mockReturnValue({
      feedback: 'Burned out',
      day_of_streak: 3,
      source: 'http://github.com',
      created_at: new Date()
    });
    feedbackRepository.dbProvider.add = jest.fn().mockReturnValue([10]);
    jest.spyOn(feedbackRepository.dbProvider, 'add')

    const feedBack = {
      source: 'http://github.com',
      feedback: 'Just happy!',
      createdAt: new Date()
    }
    const result = await feedbackRepository.saveFeedback(feedBack);

    expect(result).toBe(10);
    expect(feedbackRepository.dbProvider.add.mock.calls[0][1].day_of_streak).toBe(3);
  });

  it("should use last feedback's streak for weekends", async () => {

    const feedBack = {
      source: 'http://github.com',
      feedback: 'Burned out',
      createdAt: new Date(2023, 1, 5)
    }
    const feedbackRepository = new FeedbackRepository();
    feedbackRepository.dbProvider.query = jest.fn().mockReturnThis();
    feedbackRepository.dbProvider.orderBy = jest.fn().mockReturnThis();
    feedbackRepository.dbProvider.first = jest.fn().mockReturnValue({
      feedback: 'Burned out',
      day_of_streak: 2,
      source: 'http://github.com',
      created_at: new Date()
    });
    feedbackRepository.dbProvider.add = jest.fn().mockReturnValue([10]);
    jest.spyOn(feedbackRepository.dbProvider, 'add')

    const result = await feedbackRepository.saveFeedback(feedBack);

    expect(result).toBe(10);
    expect(feedbackRepository.dbProvider.add.mock.calls[0][1].day_of_streak).toBe(2);
  });


  it("should increment streak", async () => {

    const feedBack = {
      source: 'http://github.com',
      feedback: 'Burned out',
      createdAt: new Date(2023, 1, 3)
    }
    const feedbackRepository = new FeedbackRepository();
    feedbackRepository.dbProvider.query = jest.fn().mockReturnThis();
    feedbackRepository.dbProvider.orderBy = jest.fn().mockReturnThis();
    feedbackRepository.dbProvider.first = jest.fn().mockReturnValue({
      feedback: 'Burned out',
      day_of_streak: 2,
      source: 'http://github.com',
      created_at: new Date(2023, 1, 2)
    });
    feedbackRepository.dbProvider.add = jest.fn().mockReturnValue([10]);
    jest.spyOn(feedbackRepository.dbProvider, 'add')

    const result = await feedbackRepository.saveFeedback(feedBack);

    expect(result).toBe(10);
    expect(feedbackRepository.dbProvider.add.mock.calls[0][1].day_of_streak).toBe(3);
  });

  it("should start a new streak", async () => {

    const feedBack = {
      source: 'http://github.com',
      feedback: 'Burned out',
      createdAt: new Date(2023, 1, 3)
    }
    const feedbackRepository = new FeedbackRepository();
    feedbackRepository.dbProvider.query = jest.fn().mockReturnThis();
    feedbackRepository.dbProvider.orderBy = jest.fn().mockReturnThis();
    feedbackRepository.dbProvider.first = jest.fn().mockReturnValue({
      feedback: 'Burned out',
      day_of_streak: 2,
      source: 'http://github.com',
      created_at: new Date(2023, 1, 1)
    });
    feedbackRepository.dbProvider.add = jest.fn().mockReturnValue([10]);
    jest.spyOn(feedbackRepository.dbProvider, 'add')

    const result = await feedbackRepository.saveFeedback(feedBack);

    expect(result).toBe(10);
    expect(feedbackRepository.dbProvider.add.mock.calls[0][1].day_of_streak).toBe(1);
  });

});