const DatabaseFactory = require("../providers/database");

class FeedbackTagRepository {
    constructor() {
        this.dbProvider = DatabaseFactory.getDatabaseProvider();
        this.tableName = "feedback_tag";
    }

    async saveTagsForFeedback(feedbackId, tagIds) {
        return this.dbProvider.addMany(this.tableName, tagIds.map(tagId => ({
            tag_id: tagId,
            feedback_id: feedbackId,
        })));
    }

    async list() {
        return this.dbProvider.list(this.tableName, {});
    }
}

module.exports = FeedbackTagRepository;
