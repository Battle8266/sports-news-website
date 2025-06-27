const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const auth = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');
const logger = require('../utils/logger');

router.post('/', async (req, res) => {
  const { name, email, favoriteSports, feedback, wantsToContribute } = req.body;
  try {
    const newFeedback = new Feedback({
      name,
      email,
      favoriteSports,
      feedback,
      wantsToContribute,
    });
    await newFeedback.save();
    logger(`Feedback submitted by ${email}`);
    res.status(201).json({ message: 'Feedback submitted' });
  } catch (error) {
    logger(`Error submitting feedback: ${error.message}`);
    res.status(500).json({ message: 'Error submitting feedback', error });
  }
});

router.get('/', auth, roleCheck(['Owner', 'Admin']), async (req, res) => {
  try {
    const feedbacks = await Feedback.find();
    res.json(feedbacks);
  } catch (error) {
    logger(`Error fetching feedback: ${error.message}`);
    res.status(500).json({ message: 'Error fetching feedback', error });
  }
});

module.exports = router;