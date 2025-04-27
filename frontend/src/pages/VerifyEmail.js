import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Button
} from '@mui/material';
import axios from 'axios';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const token = searchParams.get('token');
        if (!token) {
          setError('Invalid verification link');
          setLoading(false);
          return;
        }

        console.log('Verifying email with token:', token);
        const response = await axios.get(`http://localhost:5000/api/auth/verify-email/${token}`);
        console.log('Verification response:', response.data);

        // If we get here, the verification was successful
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (err) {
        console.error('Verification error:', err.response?.data);
        
        // Check for specific error cases
        if (err.response?.data?.error === 'Email is already verified') {
          setSuccess(true);
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        } else if (err.response?.data?.error === 'Invalid or expired verification token') {
          // Try to check if the user is already verified
          try {
            const email = searchParams.get('email');
            if (email) {
              const checkResponse = await axios.get(`http://localhost:5000/api/auth/check-verification/${email}`);
              if (checkResponse.data?.isVerified) {
                setSuccess(true);
                setTimeout(() => {
                  navigate('/login');
                }, 3000);
                return;
              }
            }
          } catch (checkErr) {
            console.error('Check verification error:', checkErr);
          }
          setError('Invalid or expired verification link');
        } else {
          setError(err.response?.data?.error || 'Failed to verify email');
        }
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <CircularProgress />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Verifying your email...
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        {error ? (
          <>
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
            <Box sx={{ textAlign: 'center' }}>
              <Button
                variant="contained"
                onClick={() => navigate('/login')}
                sx={{ mt: 2 }}
              >
                Go to Login
              </Button>
            </Box>
          </>
        ) : (
          <>
            <Alert severity="success" sx={{ mb: 3 }}>
              Email verified successfully! Redirecting to login...
            </Alert>
            <Box sx={{ textAlign: 'center' }}>
              <Button
                variant="contained"
                onClick={() => navigate('/login')}
                sx={{ mt: 2 }}
              >
                Go to Login Now
              </Button>
            </Box>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default VerifyEmail; 