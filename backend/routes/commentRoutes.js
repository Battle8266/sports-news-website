const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const auth = require('../middleware/auth');
const logger = require('../utils/logger');

router.post('/', auth, async (req, res) => {
  const { newsId, content } = req.body;
  try {
    const comment = new Comment({
      newsId,
      userId: req.user.id,
      content,
    });
    await comment.save();
    logger(`Comment added by user ${req.user.id} on news ${newsId}`);
    res.status(201).json(comment);
  } catch (error) {
    logger(`Error adding comment: ${error.message}`);
    res.status(500).json({ message: 'Error adding comment', error });
  }
});

router.get('/news/:newsId', async (req, res) => {
  try {
    const comments = await Comment.find({ newsId: req.params.newsId }).populate('userId', 'username');
    res.json(comments);
  } catch (error) {
    logger(`Error fetching comments: ${error.message}`);
    res.status(500).json({ message: 'Error fetching comments', error });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    if (comment.userId.toString() !== req.user.id && !['Owner', 'Admin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }
    await comment.remove();
    logger(`Comment ${req.params.id} deleted by user ${req.user.id}`);
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    logger(`Error deleting comment: ${error.message}`);
    res.status(500).json({ message: 'Error deleting comment', error });
  }
});

module.exports = router;