const express = require('express');
const router = express.Router();
const { fetchLiveScores, summarizeScoresWithGrok } = require('../services/newsScraper');
const auth = require('../middleware/auth');

router.get('/live-scores', auth, async (req, res) => {
  try {
    const scores = await fetchLiveScores();
    const summary = await summarizeScoresWithGrok(scores);
    res.json({
      message: 'NFL लाइव स्कोर और समरी प्राप्त हुए',
      data: scores,
      summary: summary,
    });
  } catch (error) {
    res.status(500).json({ message: 'लाइव स्कोर प्राप्त करने में एरर', error: error.message });
  }
});

module.exports = router;