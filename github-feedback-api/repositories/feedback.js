const DatabaseFactory = require("../providers/database");
const FeedbackModel = require("../models/feedback");
const {differenceInBusinessDays, formatISO, differenceInDays, differenceInCalendarDays, isWeekend} = require("date-fns");

class FeedbackRepository {
    constructor() {
        this.dbProvider = DatabaseFactory.getDatabaseProvider();
        this.tableName = "feedback";
        FeedbackModel.knex(this.dbProvider.client);
    }

    async getTodaysCheckInsCount() {
        const knexClient = this.dbProvider.client;

        return FeedbackModel
            .query()
            .where('created_at', '>=', knexClient.raw(`current_date`))
            .where('created_at', '<', knexClient.raw(`current_date + interval '1 day'`))
            .resultSize();
    }

    async getLongestStreak() {
        const feedback = await FeedbackModel
            .query()
            .orderBy('day_of_streak', 'desc')
            .first();

        if (feedback) {
            return feedback.day_of_streak;
        } else {
            return 0;
        }
    }

    async getCurrentStreak() {
        const feedback = await FeedbackModel
            .query()
            .orderBy('created_at', 'desc')
            .first();

        if (feedback) {
            return feedback.day_of_streak;
        } else {
            return 0;
        }
    }

    async getAllFeedbacks() {
        return FeedbackModel
            .query()
            .select(
                'feedback.*',
                FeedbackModel.relatedQuery('moods')
                    .avg('sentiment_value')
                    .as('average_sentiment'))
            .withGraphJoined('[moods, tags]');
    }

    async getFeedback(id) {
        return this.dbProvider.query(this.tableName).where('id', id).first();
    }

    async saveFeedback({source, feedback, createdAt = new Date()}) {
        const latestFeedback = await this.dbProvider.query(this.tableName).orderBy('created_at', 'desc').first();

        let dayOfStreak = 1;
        if (latestFeedback) {
            const lastFeedbackDate = latestFeedback.created_at;
            const diffInBusinessDays = Math.abs(differenceInBusinessDays(lastFeedbackDate, createdAt));

            if (isWeekend(createdAt)) {
                dayOfStreak = latestFeedback.day_of_streak;
            } else {
                switch (diffInBusinessDays) {
                    case 1:
                        dayOfStreak = latestFeedback.day_of_streak + 1;
                        break;
                    case 0:
                        dayOfStreak = latestFeedback.day_of_streak;
                        break;
                    default:
                        dayOfStreak = 1;
                        break;
                }
            }
        }

        const [id] = await this.dbProvider.add(this.tableName, {
            feedback,
            day_of_streak: dayOfStreak,
            source,
            created_at: formatISO(createdAt)
        });

        return id;
    }
}

module.exports = FeedbackRepository;
