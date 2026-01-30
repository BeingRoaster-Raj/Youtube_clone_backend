# YouTube Clone Backend

A backend API for a YouTube-like video streaming platform built with Node.js, Express, and MongoDB.

## Features

- User authentication and authorization (JWT-based)
- User registration and login with password encryption
- Video upload and management
- User subscription system
- File uploads to Cloudinary
- Secure API endpoints with middleware authentication
- Pagination support for video queries using mongoose-aggregate-paginate-v2

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcryptjs
- **File Upload:** Multer + Cloudinary
- **Pagination:** mongoose-aggregate-paginate-v2

## Installation

### Prerequisites
- Node.js (v14+)
- MongoDB
- Cloudinary account (for file uploads)

### Setup

1. Clone the repository
```bash
git clone <repository-url>
cd Youtube_clone_Backend
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory and add:
```
PORT=8000
MONGODB_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
CLOUDINARY_NAME=<your-cloudinary-name>
CLOUDINARY_API_KEY=<your-api-key>
CLOUDINARY_API_SECRET=<your-api-secret>
```

## Project Structure

```
src/
├── app.js                 # Express app configuration
├── index.js              # Server entry point
├── constants.js          # Application constants
├── controllers/          # Business logic
│   └── user.controller.js
├── models/               # MongoDB schemas
│   ├── user.model.js
│   ├── video.model.js
│   └── subscription.model.js
├── routes/               # API endpoints
│   └── user.routes.js
├── middlewares/          # Custom middleware
│   ├── auth.middleware.js
│   └── Multer.middleware.js
├── db/                   # Database connection
│   └── index.js
└── utils/                # Utility functions
    ├── asyncHandler.js
    ├── ApiResponse.js
    ├── ApiError.js
    └── cloudinary.js
```

## API Endpoints

### User Routes
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `POST /api/users/logout` - Logout user (protected)
- `GET /api/users/profile` - Get user profile (protected)
- also different routes 

## Database Models

### User Model
- Stores user information
- Password hashing using bcryptjs pre-hooks
- JWT token generation methods

### Video Model
- Video metadata and content
- Aggregation queries with pagination support

### Subscription Model
- User subscription relationships

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Running the Project

```bash
npm start
```

The server will start on the port specified in your `.env` file (default: 8000).

## File Uploads

Files are uploaded via Multer middleware and stored on Cloudinary. Configure Cloudinary credentials in `.env`.

## Contributing

Feel free to submit issues and enhancement requests!
