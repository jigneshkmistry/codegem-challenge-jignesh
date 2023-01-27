const {Model} = require("objection");
const MoodModel = require("./mood");
const TagModel = require("./tag");

class FeedbackModel extends Model {
    static get tableName () {
        return 'feedback';
    }

    static get relationMappings() {
        return {
            moods: {
                relation: Model.ManyToManyRelation,
                modelClass: MoodModel,
                join: {
                    from: 'feedback.id',
                    through: {
                        from: 'feedback_mood.feedback_id',
                        to: 'feedback_mood.mood_id'
                    },
                    to: 'mood.id'
                }
            },
            tags: {
                relation: Model.ManyToManyRelation,
                modelClass: TagModel,
                join: {
                    from: 'feedback.id',
                    through: {
                        from: 'feedback_tag.feedback_id',
                        to: 'feedback_tag.tag_id'
                    },
                    to: 'tag.id'
                }
            }
        };
    }
}

module.exports = FeedbackModel;
