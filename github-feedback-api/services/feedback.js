const FeedbackRepository = require("../repositories/feedback");
const FeedbackMoodRepository = require("../repositories/feedbackMood");
const FeedbackTagRepository = require("../repositories/feedbackTag");

class FeedbackService {
    constructor() {
        this.repository = new FeedbackRepository();
        this.feedbackMoodRepository = new FeedbackMoodRepository();
        this.feedbackTagRepository = new FeedbackTagRepository();
    }

    async saveFeedback({source, feedback, moods, tags}, createdAt = new Date()) {
        const feedbackId = await this.repository.saveFeedback({feedback, source, createdAt});

        await Promise.all([
            this.feedbackMoodRepository.saveMoodsForFeedback(feedbackId, moods),
            this.feedbackTagRepository.saveTagsForFeedback(feedbackId, tags)
        ]);

        return feedbackId;
    }
}

module.exports = FeedbackService;
