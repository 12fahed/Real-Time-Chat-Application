# Real-Time Chat Application - Web Application Developer Intern Assignment

## Objective
Build a real-time chat application using the MERN Stack (MongoDB, Express, React, and Node.js) to assess skills in backend development, API design, real-time data handling, and full-stack application architecture.

## Project Features

### 1. User Authentication
- Secure user registration and login
- JWT (JSON Web Tokens) for session management
- Secure user details storage in MongoDB
- Password validation and hashing
- OTP Verification via email

### 2. Chat Functionality
- Real-time messaging for authenticated users
- WebSocket implementation using Socket.io
- Live chat without page refresh
- Chat history persistence in MongoDB
- Chat only possible between users with saved contacts

### 3. User Interface
- React-based frontend
- Online users list
- Simple chat interface
- Message input field
- Chat message display area

### 4. Advanced Features
- Online/Offline presence indicator
- Typing indicators
- Message timestamps
- Read receipts
- Multi-theme support
- Minimalist design

## Technical Requirements

### Backend
- Node.js and Express server
- RESTful API endpoints
- MongoDB for data storage
- Socket.io for real-time communication
- JWT Authentication

### Frontend
- React
- Socket.io-client
- Responsive design

### Database Schema
#### User Profile
- Username
- Email
- Password (hashed)
- Phone Number
- Contacts

#### Message
- Sender
- Receiver
- Message Content
- Timestamp
- Read Status

## Prerequisites
- Node.js (v14+)
- npm (v6+)
- MongoDB
- Git

## Installation and Setup

### 1. Clone the Repository
```bash
git clone https://github.com/12fahed/Learniee_Task.git
cd Learniee_Task
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` in backend directory:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_SERVICE_CONFIG=your_email_service_configuration
```

Run backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

Create `.env` in frontend directory:
```
REACT_APP_API_URL=http://localhost:5000
```

Run frontend:
```bash
npm run dev
```

## Usage Instructions

1. Create an account with:
   - Email
   - Name
   - Password
   - Phone Number

2. Verify account via OTP sent to email

3. Add contacts by phone number

4. Start chatting with saved contacts

## Authorization Methods
- JWT Token Authentication
- OTP Email Verification

## Security Features
- Secure password storage
- Contact-based messaging
- Email verification
- Token-based authentication

## Themes
- Multiple theme support
- Minimalist design
- Easy theme switching

## Contribution Guidelines
1. Fork the repository
2. Create feature branch: `git checkout -b feature/YourFeature`
3. Commit changes: `git commit -m 'Add YourFeature'`
4. Push to branch: `git push origin feature/YourFeature`
5. Open Pull Request

## Recommended Development Environment
- Visual Studio Code
- MongoDB Compass
- Postman for API testing

## Troubleshooting
- Ensure all environment variables are correctly set
- Check MongoDB connection
- Verify Node.js and npm versions
- Ensure all dependencies are installed

## Performance Optimization
- Implement pagination for chat history
- Use efficient indexing in MongoDB
- Optimize WebSocket connections
- Implement caching mechanisms

## Future Enhancements
- Group chat functionality
- File sharing
- Advanced user profiles
- End-to-end encryption
- Video/Audio chat integration



## Contact
Fahed Khan
```

This comprehensive README.md file combines all the details from the original assignment, including the project overview, technical requirements, installation steps, features, and additional useful information for developers and users.

The README provides a holistic view of the chat application, covering everything from setup instructions to potential future enhancements. Would you like me to modify or refine any section?