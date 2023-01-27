require('dotenv').config();
const express = require("express");
const app = express();
const cors = require("cors");
const FeedbackService = require("./services/feedback");
const {validationResult, body} = require("express-validator");
const TagRepository = require("./repositories/tag");
const MoodRepository = require("./repositories/mood");
const FeedbackRepository = require("./repositories/feedback");

const APPROVED_ORIGINS = new Set(
    JSON.parse(process.env.APPROVED_ORIGINS || '["https://github.com", "http://localhost:8080"]')
);

app.use(express.json());
app.use(cors({
    origin: (origin, callback) => {
        let allowed = APPROVED_ORIGINS.has(origin);

        callback(allowed ? null : new Error("not an allowed origin"), allowed);
    },
    optionsSuccessStatus: 200
}));

app.get('/tags', async (req, res) => {
    const tagRepository = new TagRepository();
    res.status(200).json(await tagRepository.list());
});

app.get('/moods', async (req, res) => {
    const moodRepository = new MoodRepository();
    res.status(200).json(await moodRepository.list());
});

app.get('/check_in_status', async (req, res) => {
    const feedbackRepository = new FeedbackRepository();
    res.status(200).json({
        isTodaysCheckInDone: (await feedbackRepository.getTodaysCheckInsCount()) > 0,
        longestStreak: await feedbackRepository.getLongestStreak(),
        currentStreak: await feedbackRepository.getCurrentStreak(),
    });
});

app.get('/feedback', async (req, res) => {
    const feedbackRepository = new FeedbackRepository();
    res.status(200).json(await feedbackRepository.getAllFeedbacks());
});

app.post("/feedback",
    body('feedback').exists().isString(),
    body('moods').exists().isArray(),
    body('tags').exists().isArray(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }

        let service = new FeedbackService();
        const {feedback, moods, tags, source} = req.body;

        const feedbackId = await service.saveFeedback({
            feedback, moods, tags, source
        });

        res.status(201).json({feedbackId});
    });

const port = process.env.API_PORT || 3000;
const host = process.env.API_HOST || "localhost";

app.listen(port, host, () => {
    console.log(`listening to ${host} on port ${port}`);
});
