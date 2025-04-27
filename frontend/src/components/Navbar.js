import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { AccountCircle, Menu as MenuIcon, People as PeopleIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenu = (event) => {
    setMobileMenuAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    handleMobileMenuClose();
    logout();
    navigate('/');
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

  return (
    <AppBar position="sticky" color="default" elevation={0}>
      <Toolbar>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'primary.main',
            fontWeight: 700,
            letterSpacing: '-0.5px'
          }}
        >
          Blogify
        </Typography>

        {isMobile ? (
          <>
            <IconButton
              size="large"
              onClick={handleMobileMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={mobileMenuAnchorEl}
              open={Boolean(mobileMenuAnchorEl)}
              onClose={handleMobileMenuClose}
            >
              {user ? (
                <>
                  {isAdmin && (
                    <>
                      <MenuItem
                        component={RouterLink}
                        to="/admin"
                        onClick={handleMobileMenuClose}
                      >
                        Admin Dashboard
                      </MenuItem>
                      <MenuItem
                        component={RouterLink}
                        to="/admin/users"
                        onClick={handleMobileMenuClose}
                      >
                        User Management
                      </MenuItem>
                    </>
                  )}
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </>
              ) : (
                <>
                  <MenuItem
                    component={RouterLink}
                    to="/login"
                    onClick={handleMobileMenuClose}
                  >
                    Login
                  </MenuItem>
                  <MenuItem
                    component={RouterLink}
                    to="/signup"
                    onClick={handleMobileMenuClose}
                  >
                    Sign Up
                  </MenuItem>
                </>
              )}
            </Menu>
          </>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {user ? (
              <>
                {isAdmin && (
                  <>
                    <Button
                      color="primary"
                      component={RouterLink}
                      to="/admin"
                      variant="outlined"
                    >
                      Admin Dashboard
                    </Button>
                    <Button
                      color="primary"
                      component={RouterLink}
                      to="/admin/users"
                      variant="outlined"
                      startIcon={<PeopleIcon />}
                    >
                      Users
                    </Button>
                  </>
                )}
                <IconButton
                  size="large"
                  onClick={handleMenu}
                  color="inherit"
                >
                  {user.name ? (
                    <Avatar
                      sx={{
                        bgcolor: 'primary.main',
                        width: 32,
                        height: 32,
                        fontSize: '0.875rem'
                      }}
                    >
                      {getInitials(user.name)}
                    </Avatar>
                  ) : (
                    <AccountCircle />
                  )}
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button
                  color="primary"
                  component={RouterLink}
                  to="/login"
                  variant="outlined"
                >
                  Login
                </Button>
                <Button
                  color="primary"
                  component={RouterLink}
                  to="/signup"
                  variant="contained"
                >
                  Sign Up
                </Button>
              </>
            )}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 