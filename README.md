# Blog Platform with Role-Based Access Control

A full-stack blog platform built with React, Node.js, Express, and MongoDB, featuring role-based access control, real-time updates, and email verification.

## Features

- **Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (User, Admin, Super Admin)
  - Email verification
  - Account locking after failed attempts
  - Refresh token mechanism

- **Blog Management**
  - Create, read, update, and delete blog posts
  - Real-time updates using Socket.IO
  - Author information display
  - Timestamp tracking

- **User Management**
  - User registration and login
  - Role management
  - User verification
  - Profile management

- **Security Features**
  - Password hashing
  - Rate limiting
  - CORS protection
  - Secure token management

- **UI/UX**
  - Modern Material-UI design
  - Responsive layout
  - Real-time notifications
  - Loading states
  - Error handling

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn
- Email service (for verification)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd blog-platform
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Create a `.env` file in the backend directory with the following variables:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
EMAIL_USER=your_email_for_verification
EMAIL_PASS=your_email_password
PORT=5000
```

## Running the Application

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend server:
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Creating a Super Admin

To create a super admin account, run:
```bash
cd backend
node scripts/createSuperAdmin.js
```

Default super admin credentials:
- Email: admin@blogify.com
- Password: Admin@123

## Project Structure

```
blog-platform/
├── backend/
│   ├── middleware/
│   │   ├── auth.js
│   │   └── permissions.js
│   ├── models/
│   │   ├── User.js
│   │   └── Post.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── posts.js
│   ├── scripts/
│   │   └── createSuperAdmin.js
│   ├── server.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── contexts/
    │   ├── pages/
    │   ├── services/
    │   └── App.js
    └── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile
- `GET /api/auth/verify-email/:token` - Verify email

### Posts
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create post (admin only)
- `PUT /api/posts/:id` - Update post (admin only)
- `DELETE /api/posts/:id` - Delete post (admin only)

### User Management
- `GET /api/auth/users` - Get all users (admin only)
- `DELETE /api/auth/users/:userId` - Delete user (admin only)
- `PUT /api/auth/users/:userId/verify` - Verify user (admin only)
- `PUT /api/auth/users/:userId/role` - Update user role (admin only)

## Security Considerations

- All passwords are hashed using bcrypt
- JWT tokens are used for authentication
- Rate limiting is implemented for sensitive routes
- CORS is configured for security
- Account locking after failed login attempts
- Email verification required for account activation
