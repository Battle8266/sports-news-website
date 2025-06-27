const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  newsId: { type: String, required: true },
  comment: { type: String, required: true },
  user: { type: String, default: 'Anonymous' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Comment', commentSchema, 'comments');