const axios = require('axios');
const logger = require('../utils/logger');

const verifyNews = async (text) => {
  try {
    if (!process.env.GROK_API_KEY || process.env.GROK_API_KEY === 'your_grok_api_key') {
      // डमी लॉजिक अगर GROK_API_KEY नहीं है
      const isVerified = text.includes('ESPN') || text.includes('Cricbuzz');
      logger(`News verification (dummy) result: ${isVerified} for text: ${text.substring(0, 50)}...`);
      return { isVerified, source: 'Dummy Verification' };
    }

    // असली Grok API कॉल (xAI API एंडपॉइंट डालें)
    const response = await axios.post(
      'https://api.x.ai/v1/grok/verify', // डमी एंडपॉइंट, असली API के लिए अपडेट करें
      { text },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROK_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const isVerified = response.data.isVerified || false;
    const source = 'Grok API';
    logger(`News verification (Grok) result: ${isVerified} for text: ${text.substring(0, 50)}...`);
    return { isVerified, source };
  } catch (error) {
    logger(`Error verifying news with Grok API: ${error.message}`);
    return { isVerified: false, source: 'Grok API Error' };
  }
};

module.exports = { verifyNews };