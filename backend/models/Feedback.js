const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  newsId: { type: String, required: true },
  feedback: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5 },
  user: { type: String, default: 'Anonymous' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Feedback', feedbackSchema, 'feedback');