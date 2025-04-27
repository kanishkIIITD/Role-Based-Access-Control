import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  CircularProgress,
  Chip,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
  Snackbar,
  Alert
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  const { user } = useAuth();
  const socket = useSocket();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/posts');
        setPosts(response.data);
      } catch (err) {
        setError('Failed to fetch posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('newPost', (post) => {
      console.log('New post received:', post); // Debug log
      if (post.author && post.author.name) {
        setPosts(prevPosts => [post, ...prevPosts]);
        setNotification({
          open: true,
          message: 'New post published!',
          severity: 'info'
        });
      } else {
        console.error('Received post without author information:', post);
      }
    });

    socket.on('postUpdated', (updatedPost) => {
      console.log('Post updated:', updatedPost); // Debug log
      if (updatedPost.author && updatedPost.author.name) {
        setPosts(prevPosts =>
          prevPosts.map(post =>
            post._id === updatedPost._id ? updatedPost : post
          )
        );
        setNotification({
          open: true,
          message: 'Post updated!',
          severity: 'info'
        });
      } else {
        console.error('Received updated post without author information:', updatedPost);
      }
    });

    socket.on('postDeleted', (postId) => {
      console.log('Post deleted:', postId); // Debug log
      setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
      setNotification({
        open: true,
        message: 'Post deleted!',
        severity: 'info'
      });
    });

    return () => {
      socket.off('newPost');
      socket.off('postUpdated');
      socket.off('postDeleted');
    };
  }, [socket]);

  const handleDelete = async (postId) => {
    try {
      await axios.delete(`http://localhost:5000/api/posts/${postId}`);
      setPosts(posts.filter(post => post._id !== postId));
    } catch (err) {
      setError('Failed to delete post');
    }
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error" align="center">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Latest Posts
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Discover the latest articles from our community
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {posts.map((post) => (
          <Grid item xs={12} md={6} lg={4} key={post._id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                },
              }}
            >
              <CardContent>
                <Typography
                  variant="h5"
                  component="h2"
                  gutterBottom
                  sx={{
                    fontWeight: 600,
                    color: 'text.primary',
                    mb: 2,
                  }}
                >
                  {post.title}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  paragraph
                  sx={{
                    mb: 2,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {post.content}
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mt: 'auto',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {post.author && post.author.name ? (
                      <Chip
                        label={post.author.name}
                        size="small"
                        sx={{ bgcolor: 'primary.light', color: 'white' }}
                      />
                    ) : (
                      <Chip
                        label="Unknown Author"
                        size="small"
                        sx={{ bgcolor: 'error.light', color: 'white' }}
                      />
                    )}
                    <Typography variant="caption" color="text.secondary">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
              {(user?.role === 'admin' || user?.role === 'super_admin') && (
                <CardActions sx={{ justifyContent: 'flex-end', p: 2, pt: 0 }}>
                  <Tooltip title="Edit">
                    <IconButton size="small" color="primary">
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(post._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Home; 