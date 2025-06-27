const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  newsId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  sport: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('News', newsSchema, 'news');