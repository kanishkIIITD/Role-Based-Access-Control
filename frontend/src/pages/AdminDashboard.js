import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import axios from 'axios';

const AdminDashboard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingPost, setEditingPost] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in localStorage');
      return {};
    }
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/posts', getAuthHeader());
      console.log('Posts response:', response.data);
      setPosts(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError(err.response?.data?.error || 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }

    try {
      const authHeader = getAuthHeader();
      console.log('Auth header:', authHeader);

      if (editingPost) {
        const response = await axios.put(
          `http://localhost:5000/api/posts/${editingPost._id}`,
          { title, content },
          authHeader
        );
        console.log('Update response:', response.data);
        setPosts(posts.map(post =>
          post._id === editingPost._id ? { ...post, title, content } : post
        ));
      } else {
        const response = await axios.post(
          'http://localhost:5000/api/posts',
          { title, content },
          authHeader
        );
        console.log('Create response:', response.data);
        setPosts([...posts, response.data]);
      }

      setTitle('');
      setContent('');
      setEditingPost(null);
      setOpenDialog(false);
    } catch (err) {
      console.error('Error saving post:', err);
      setError(err.response?.data?.error || 'Failed to save post');
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setTitle(post.title);
    setContent(post.content);
    setOpenDialog(true);
  };

  const handleDelete = async (postId) => {
    try {
      await axios.delete(`http://localhost:5000/api/posts/${postId}`, getAuthHeader());
      setPosts(posts.filter(post => post._id !== postId));
    } catch (err) {
      console.error('Error deleting post:', err);
      setError(err.response?.data?.error || 'Failed to delete post');
    }
  };

  const handleOpenDialog = () => {
    setEditingPost(null);
    setTitle('');
    setContent('');
    setOpenDialog(true);
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          Admin Dashboard
        </Typography>
        <Button variant="contained" onClick={handleOpenDialog}>
          Create New Post
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper>
        <List>
          {posts.map((post) => (
            <ListItem key={post._id}>
              <ListItemText
                primary={post.title}
                secondary={new Date(post.createdAt).toLocaleDateString()}
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" onClick={() => handleEdit(post)}>
                  <EditIcon />
                </IconButton>
                <IconButton edge="end" onClick={() => handleDelete(post._id)}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {editingPost ? 'Edit Post' : 'Create New Post'}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            fullWidth
            margin="normal"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <TextField
            label="Content"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingPost ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminDashboard; 