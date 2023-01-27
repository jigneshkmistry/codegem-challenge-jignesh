require('dotenv').config();
const FeedbackService = require("./services/feedback");
const {parseISO} = require("date-fns");
const knex = require('./connections/db_knex');

const service = new FeedbackService();
const source = 'http://github.com';

const feedbackItems = [
    {
        createdAt: parseISO('2022-03-10 09:23:00'),
        feedback: 'I am very happy today because I got code reviews on time!',
        moods: [2, 3],
        tags: [3, 4, 1],
    },
    {
        createdAt: parseISO('2022-03-10 19:10:00'),
        feedback: 'Burned out :(',
        moods: [1, 10],
        tags: [],
    },
    {
        createdAt: parseISO('2022-03-11 13:20:00'),
        feedback: 'Just a normal day I guess',
        moods: [2],
        tags: [],
    },
    {
        createdAt: parseISO('2022-03-14 11:02:00'),
        feedback: 'Just happy!',
        moods: [9, 8, 13],
        tags: [1, 2, 3],
    },
    {
        createdAt: parseISO('2022-03-15 20:18:00'),
        feedback: 'Not a great day at all, my internet broke.',
        moods: [1, 2, 4, 5],
        tags: [],
    },
    {
        createdAt: parseISO('2022-03-25 17:30:00'),
        feedback: 'Best day ever!',
        moods: [2, 3],
        tags: [3, 4, 1],
    }
];

(async () => {
    for (const feedback of feedbackItems) {
        console.log(`Creating feedback... "${feedback.feedback}"`);
        await service.saveFeedback({...feedback, source}, feedback.createdAt);
    }
    console.log('Done!');
    await knex.destroy();
})();
