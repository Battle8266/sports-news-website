const FeedParser = require('feedparser');
const request = require('request');
const News = require('../models/News');
const { verifyNews } = require('./newsVerification');
const logger = require('../utils/logger');

const scrapeNews = async () => {
  const url = 'https://www.espn.com/espn/rss/news';
  const feedparser = new FeedParser();
  const newsItems = [];

  return new Promise((resolve, reject) => {
    const req = request(url);

    req.on('error', (error) => {
      logger(`Error fetching RSS feed: ${error.message}`);
      reject(error);
    });

    req.on('response', function (res) {
      if (res.statusCode !== 200) {
        const error = new Error('Bad status code');
        logger(`Error: Bad status code ${res.statusCode}`);
        reject(error);
        return;
      }
      this.pipe(feedparser);
    });

    feedparser.on('error', (error) => {
      logger(`FeedParser error: ${error.message}`);
      reject(error);
    });

    feedparser.on('readable', function () {
      let item;
      while ((item = this.read())) {
        newsItems.push(item);
      }
    });

    feedparser.on('end', async () => {
      try {
        for (const item of newsItems) {
          const verificationResult = await verifyNews(item.title + ' ' + (item.description || ''));
          const news = new News({
            title: item.title || 'No title',
            description: item.description || 'No description available',
            link: item.link || '',
            source: 'ESPN',
            category: 'Sports',
            verified: verificationResult.isVerified,
            verificationSource: verificationResult.source, // Grok API से
            pubDate: item.pubDate || Date.now(),
          });
          await news.save();
          logger(`Saved news: ${item.title}`);
        }
        logger('News scraped and saved successfully!');
        resolve();
      } catch (error) {
        logger(`Error saving news: ${error.message}`);
        reject(error);
      }
    });
  });
};

module.exports = { scrapeNews };