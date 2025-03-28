# Lecture System

A web-based platform for managing and delivering video lectures.

## Overview

This application allows users to create, view, update, and delete lecture content with video attachments. It consists of a frontend built with modern JavaScript and a backend API.

## Features

- User authentication
- Video lecture management (CRUD operations)
- Video upload and streaming
- Responsive user interface

## Project Structure

```
lecture-system/
├── frontend/             # Frontend application
│   ├── src/
│   │   ├── services/     # API services and utilities
│   │   └── ...
│   └── ...
├── backend/              # Backend API server (Node.js)
└── ...
```

## Getting Started

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn
- MongoDB (if used as database)

### Installation

1. Clone the repository:

   ```
   git clone <repository-url>
   cd lecture-system
   ```

2. Install dependencies for frontend:

   ```
   cd frontend
   npm install
   ```

3. Install dependencies for backend:

   ```
   cd ../backend
   npm install
   ```

4. Set up environment variables:

   **Frontend (.env file in frontend directory)**

   ```
   VITE_API_URL=http://localhost:5001/api
   ```

   **Backend (.env file in backend directory)**

   ```
   PORT=5001
   MONGODB_URI=<your-mongodb-connection-string>
   JWT_SECRET=<your-secret-key>
   ```

### Running the Application

1. Start the backend server:

   ```
   cd backend
   npm start
   ```

2. Start the frontend development server:

   ```
   cd frontend
   npm run dev
   ```

3. Access the application at: `http://localhost:5173` (or the port shown in your terminal)

## API Endpoints

### Lectures

- `GET /api/lectures` - Get all lectures
- `GET /api/lectures/:id` - Get lecture by ID
- `POST /api/lectures` - Create a new lecture (requires authentication)
- `PUT /api/lectures/:id` - Update an existing lecture (requires authentication)
- `DELETE /api/lectures/:id` - Delete a lecture (requires authentication)

## Authentication

The system uses JWT (JSON Web Token) for authentication. Include the token in the Authorization header for protected routes:

```
Authorization: Bearer <your-token>
```

## Technologies Used

- **Frontend**: React, Axios, Vite
- **Backend**: Node.js, Express
- **Authentication**: JWT
- **File Storage**: [S3]

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
