const axios = require('axios');
const logger = require('../utils/logger');
require('dotenv').config();

const fetchLiveScores = async () => {
  try {
    const response = await axios.get(process.env.ESPN_API_URL, {
      params: { limit: 1000 }, // अधिकतम गेम्स के लिए
    });
    logger('NFL लाइव स्कोर सफलतापूर्वक प्राप्त हुए');
    return response.data.events; // केवल events array लौटाएं
  } catch (error) {
    logger(`NFL लाइव स्कोर प्राप्त करने में एरर: ${error.message}`);
    throw new Error('NFL लाइव स्कोर प्राप्त करने में एरर');
  }
};

const summarizeScoresWithGrok = async (scores) => {
  try {
    const grokResponse = await axios.post(
      'https://api.x.ai/v1/summarize', // Grok API एंडपॉइंट (उदाहरण)
      {
        data: JSON.stringify(scores),
        prompt: 'Summarize NFL live scores in Hindi, focusing on key matches and scores.'
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROK_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    logger('Grok API से स्कोर समरी प्राप्त हुई');
    return grokResponse.data.summary;
  } catch (error) {
    logger(`Grok API समरी में एरर: ${error.message}`);
    return scores; // अगर Grok फेल हो, तो मूल डेटा लौटाएं
  }
};

module.exports = { fetchLiveScores, summarizeScoresWithGrok };