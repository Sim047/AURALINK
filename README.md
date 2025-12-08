# ✨ AURALINK - Real-Time Chat & Events Platform

A modern, feature-rich real-time chat and events application built with the MERN stack (MongoDB, Express, React, Node.js) and Socket.IO. Auralink provides seamless communication through public chat rooms, private direct messaging, and event management with booking capabilities.

![AURALINK Logo](frontend/src/assets/auralink-logo.png)

## 🌐 Live Demo

**Access the app here:** [https://auralink-app.vercel.app](https://auralink-app.vercel.app)

## ✨ Features

### 💬 Real-Time Messaging
- **Instant messaging** with Socket.IO for real-time communication
- **Public chat rooms** (General, Random, Dev)
- **Private direct messages** with other users
- **Message reactions** with emoji support
- **Edit and delete** your own messages
- **Typing indicators** to see when others are typing
- **Online/offline status** for all users
- **Message read receipts** and timestamps

### 👥 Social Features
- **User directory** - Browse all registered users
- **Follow/Unfollow** system
- **View followers and following** lists
- **User profiles** with avatar support
- **Custom status messages** (Available, Busy, Away, Do Not Disturb)
- **Profile customization** with avatar upload

### 🎨 Modern UI/UX
- **Responsive design** - Works perfectly on desktop, tablet, and mobile
- **Dark/Light mode** toggle
- **Gradient accent colors** (Cyan to Purple theme)
- **Smooth animations** and transitions
- **Image upload and preview** in messages
- **Multiple image support** with preview modal
- **Clickable avatars** for full-size image preview
- **Search functionality** for finding users

### 🔐 Security & Authentication
- **JWT-based authentication**
- **Secure password hashing**
- **Protected routes and API endpoints**
- **User session management**

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Socket.IO Client** for real-time communication
- **Axios** for HTTP requests
- **Day.js** for date formatting

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose ODM
- **Socket.IO** for WebSocket communication
- **JWT** for authentication
- **Multer & Sharp** for image processing
- **bcrypt** for password encryption

### Deployment
- **Frontend:** Vercel
- **Backend:** Render
- **Database:** MongoDB Atlas

## 📸 Screenshots

### Desktop View
![Desktop Chat](screenshots/desktop-chat.png)
*Real-time chat with rooms and direct messages*

### Mobile View
![Mobile View](screenshots/mobile-view.png)
*Fully responsive design optimized for mobile devices*

### User Directory
![All Users](screenshots/all-users.png)
*Browse and connect with other users*

### Profile & Status
![Profile](screenshots/profile.png)
*Customize your profile and set your status*

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Sim047/AURALINK.git
cd AURALINK
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Install frontend dependencies**
```bash
cd ../frontend
npm install
```

4. **Set up environment variables**

Create `.env` file in the `backend` directory:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:5173
PORT=5000
```

Create `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:5000
```

5. **Run the application**

Backend:
```bash
cd backend
npm run dev
```

Frontend:
```bash
cd frontend
npm run dev
```

The app will be available at `http://localhost:5173`

## 📱 How to Use

### 1. **Sign Up / Login**
- Create a new account with username, email, and password
- Or login with existing credentials

### 2. **Explore Chat Rooms**
- Click on **Rooms** to see available public chat rooms
- Join General, Random, or Dev rooms
- Send messages, react, and interact in real-time

### 3. **Direct Messages**
- Browse **All Users** to find people
- Click **Message** to start a private conversation
- View your active conversations in **Direct Messages**

### 4. **Customize Your Profile**
- Set your **status** (Available, Busy, Away, Do Not Disturb)
- Upload a **profile avatar**
- Update your bio and information

### 5. **Social Connections**
- **Follow** users you want to stay connected with
- View your **Followers** and **Following** lists
- Click on any user to view their profile

### 6. **Send Rich Messages**
- Type text messages with the input box
- Upload **multiple images** using the camera icon
- **React** to messages with emojis (❤️, 🔥, 😂, 👍, 😮, 😢)
- **Edit** your messages (click edit icon)
- **Delete** messages you've sent

## 🎯 Key Features Explained

### Real-Time Communication
- Messages appear instantly without page refresh
- See who's typing in real-time
- Get notified when someone sends you a message

### Responsive Design
- **Desktop:** Full sidebar with all features visible
- **Mobile:** Optimized layout with collapsible sidebar
- **Chat View:** Message composer stays fixed at bottom
- **All Views:** Smooth scrolling and touch-friendly interface

### Message Features
- **Reactions:** Quick emoji reactions on any message
- **Editing:** Edit your messages within the chat
- **Deletion:** Remove messages (only you can delete yours)
- **Images:** Upload and share multiple images
- **Timestamps:** See when each message was sent

### User Management
- **Search:** Find users by name or email
- **Follow System:** Build your network
- **Online Status:** See who's currently active
- **Profile Views:** Check out other users' profiles

## 🔒 Privacy & Security

- All passwords are encrypted using bcrypt
- JWT tokens for secure authentication
- Protected API endpoints
- User data is stored securely in MongoDB
- CORS protection enabled

## 👨‍💻 Developer

**Created by:** Simon Kathulu  
**Copyright:** © 2025 Simon Kathulu

## 📄 License

This project is open source and available under the MIT License.

## 🐛 Bug Reports & Feature Requests

If you find a bug or have a feature request, please open an issue on GitHub.

## 🙏 Acknowledgments

- Socket.IO for real-time communication
- Tailwind CSS for beautiful styling
- Vercel and Render for hosting
- MongoDB Atlas for database services

---

**Enjoy chatting with AURALINK! 💬✨**
