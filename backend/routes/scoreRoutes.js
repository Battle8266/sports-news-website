const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');

router.get('/', async (req, res) => {
  try {
    const { sport } = req.query;

    // Mock data as a fallback for dummy API
    const mockScores = [
      {
        id: '1',
        name: 'Cricket: India vs Australia',
        score: { home: '320/5', away: '280/7' },
        status: 'Live',
        date: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'Football: Manchester United vs Chelsea',
        score: { home: '2', away: '1' },
        status: 'Live',
        date: new Date().toISOString(),
      },
      {
        id: '3',
        name: 'Cricket: England vs South Africa',
        score: { home: '150/3', away: 'N/A' },
        status: 'In Progress',
        date: new Date().toISOString(),
      },
    ];

    let scores = mockScores;

    // Filter by sport if provided
    if (sport) {
      scores = mockScores.filter(item => item.name.toLowerCase().includes(sport.toLowerCase()));
    }

    // Transform data to match frontend expectations
    const formattedScores = scores.map(item => ({
      idEvent: item.id || Math.random().toString(),
      strEvent: item.name || 'Unknown Event',
      intHomeScore: item.score?.home || 'N/A',
      intAwayScore: item.score?.away || 'N/A',
      strStatus: item.status || 'Live',
      dateEvent: item.date || new Date().toISOString(),
    }));

    logger(`Fetched mock sports data for ${sport || 'all sports'}`);
    res.json(formattedScores);
  } catch (error) {
    logger(`Error fetching mock sports data: ${error.message}`);
    res.status(500).json({ message: 'Error fetching scores', error: error.message });
  }
});

module.exports = router;