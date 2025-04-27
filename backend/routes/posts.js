const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const { verifyToken, checkRole } = require('../middleware/auth');

// Get all posts (public)
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'name email')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single post (public)
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name email');
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create post (admin and super_admin only)
router.post('/', verifyToken, checkRole(['admin', 'super_admin']), async (req, res) => {
  try {
    const { title, content } = req.body;
    const post = new Post({
      title,
      content,
      author: req.user._id
    });
    await post.save();
    
    // Populate author information before emitting
    const populatedPost = await Post.findById(post._id)
      .populate('author', 'name email');
    
    // Emit new post event with populated data
    const io = req.app.get('io');
    io.emit('newPost', populatedPost);
    
    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update post (admin and super_admin only)
router.put('/:id', verifyToken, checkRole(['admin', 'super_admin']), async (req, res) => {
  try {
    const { title, content } = req.body;
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true }
    ).populate('author', 'name email');
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    // Emit post update event
    const io = req.app.get('io');
    io.emit('postUpdated', post);
    
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete post (admin and super_admin only)
router.delete('/:id', verifyToken, checkRole(['admin', 'super_admin']), async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    // Emit post deletion event
    const io = req.app.get('io');
    io.emit('postDeleted', post._id);
    
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 