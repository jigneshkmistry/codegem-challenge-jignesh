const DatabaseFactory = require("../providers/database");

class FeedbackMoodRepository {
    constructor() {
        this.dbProvider = DatabaseFactory.getDatabaseProvider();
        this.tableName = "feedback_mood";
    }

    async saveMoodsForFeedback(feedbackId, moodIds) {
        return this.dbProvider.addMany(this.tableName, moodIds.map(moodId => ({
            mood_id: moodId,
            feedback_id: feedbackId,
        })));
    }

    async list() {
        return this.dbProvider.list(this.tableName, {});
    }
}

module.exports = FeedbackMoodRepository;
