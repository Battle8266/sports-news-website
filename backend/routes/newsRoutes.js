const express = require('express');
const router = express.Router();
const News = require('../models/News');
const Comment = require('../models/Comment');
const Feedback = require('../models/Feedback');
const logger = require('../utils/logger');

// POST route to create/save news
router.post('/', async (req, res) => {
  try {
    const { newsId, title, content, sport } = req.body;

    if (!newsId || !title || !content) {
      return res.status(400).json({ message: 'newsId, title, और content ज़रूरी हैं' });
    }

    // Check if newsId already exists
    const existingNews = await News.findOne({ newsId });
    if (existingNews) {
      return res.status(400).json({ message: 'newsId पहले से मौजूद है, कृपया दूसरा newsId चुनें' });
    }

    const news = new News({ newsId, title, content, sport });
    await news.save();
    logger(`न्यूज़ सेव हुई: newsId=${newsId}`);
    res.status(201).json({ message: 'न्यूज़ सफलतापूर्वक सेव हुई', news });
  } catch (error) {
    logger(`न्यूज़ सेव करने में एरर: ${error.message}`);
    res.status(500).json({ message: 'न्यूज़ सेव करने में एरर', error: error.message });
  }
});

// POST route to create/save comment
router.post('/comments', async (req, res) => {
  try {
    const { newsId, comment, user } = req.body;

    if (!newsId || !comment) {
      return res.status(400).json({ message: 'newsId और comment ज़रूरी हैं' });
    }

    // Verify newsId exists
    const news = await News.findOne({ newsId });
    if (!news) {
      return res.status(404).json({ message: 'newsId के लिए कोई न्यूज़ नहीं मिली' });
    }

    const newComment = new Comment({ newsId, comment, user });
    await newComment.save();
    logger(`कमेंट सेव हुआ: newsId=${newsId}`);
    res.status(201).json({ message: 'कमेंट सफलतापूर्वक सेव हुआ', comment: newComment });
  } catch (error) {
    logger(`कमेंट सेव करने में एरर: ${error.message}`);
    res.status(500).json({ message: 'कमेंट सेव करने में एरर', error: error.message });
  }
});

// POST route to create/save feedback
router.post('/feedback', async (req, res) => {
  try {
    const { newsId, feedback, rating, user } = req.body;

    if (!newsId || !feedback) {
      return res.status(400).json({ message: 'newsId और feedback ज़रूरी हैं' });
    }

    // Verify newsId exists
    const news = await News.findOne({ newsId });
    if (!news) {
      return res.status(404).json({ message: 'newsId के लिए कोई न्यूज़ नहीं मिली' });
    }

    const newFeedback = new Feedback({ newsId, feedback, rating, user });
    await newFeedback.save();
    logger(`फीडबैक सेव हुआ: newsId=${newsId}`);
    res.status(201).json({ message: 'फीडबैक सफलतापूर्वक सेव हुआ', feedback: newFeedback });
  } catch (error) {
    logger(`फीडबैक सेव करने में एरर: ${error.message}`);
    res.status(500).json({ message: 'फीडबैक सेव करने में एरर', error: error.message });
  }
});

// GET route to fetch all news
router.get('/', async (req, res) => {
  try {
    const news = await News.find();
    logger(`फ़ेच की गईं ${news.length} न्यूज़ आइटम्स`);
    res.json(news);
  } catch (error) {
    logger(`न्यूज़ फ़ेच करने में एरर: ${error.message}`);
    res.status(500).json({ message: 'न्यूज़ फ़ेच करने में एरर', error: error.message });
  }
});

// GET route to fetch comments for a news item
router.get('/comments/:newsId', async (req, res) => {
  try {
    const comments = await Comment.find({ newsId: req.params.newsId });
    logger(`फ़ेच किए गए ${comments.length} कमेंट्स: newsId=${req.params.newsId}`);
    res.json(comments);
  } catch (error) {
    logger(`कमेंट्स फ़ेच करने में एरर: ${error.message}`);
    res.status(500).json({ message: 'कमेंट्स फ़ेच करने में एरर', error: error.message });
  }
});

// GET route to fetch feedback for a news item
router.get('/feedback/:newsId', async (req, res) => {
  try {
    const feedback = await Feedback.find({ newsId: req.params.newsId });
    logger(`फ़ेच किए गए ${feedback.length} फीडबैक: newsId=${req.params.newsId}`);
    res.json(feedback);
  } catch (error) {
    logger(`फीडबैक फ़ेच करने में एरर: ${error.message}`);
    res.status(500).json({ message: 'फीडबैक फ़ेच करने में एरर', error: error.message });
  }
});

module.exports = router;