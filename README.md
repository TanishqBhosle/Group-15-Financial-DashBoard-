# 🌿 GroWise – Smart Financial Planning Web App

## 🎯 Overview
GroWise is a modern, user-friendly personal finance management platform designed to help users track income, manage expenses, plan investments, and make smarter financial decisions. It ensures a seamless UI/UX experience, requiring minimal clicks for users to access key features—optimized for daily use.

## 🚀 Features
- 🔐 Secure JWT-based authentication
- 📊 Expense tracking with visual charts
- 💰 Smart investment planning based on risk profiles
- 👤 User profile management
- 🌙 Light/Dark theme toggle
- 📱 Responsive design for all devices

## 📂 Project Structure
The project is organized into two separate directories:
- *backend/* –  Express, MongoDB
- *frontend/* – React, Tailwind CSS

## 🛠️ Tech Stack
### Frontend
- React
- Tailwind CSS
- Framer Motion
- Recharts
- React Router DOM
- Context API

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- JWT
- bcrypt
- Mongoose

## 🔧 Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account

### Backend Setup
1. Navigate to the backend directory:
   \`\`\`
   cd backend
   \`\`\`

2. Install dependencies:
   \`\`\`
   npm install
   \`\`\`

3. Create a `.env` file in the backend directory with the following variables:
   \`\`\`
   PORT=5000
   MONGODB_URI=mongodb+srv://tanishqbhosale2006:5tB8SpwwUkpv47QD@cluster0.zjshmik.mongodb.net/
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development
   \`\`\`

4. Start the backend server:
   \`\`\`
   npm run dev
   \`\`\`

### Frontend Setup
1. Navigate to the frontend directory:
   \`\`\`
   cd frontend
   \`\`\`

2. Install dependencies:
   \`\`\`
   npm install
   \`\`\`

3. Create a `.env` file in the frontend directory with the following variables:
   \`\`\`
   REACT_APP_API_URL=http://localhost:5000/api
   \`\`\`

4. Start the frontend development server:
   \`\`\`
   npm start
   \`\`\`

5. Open your browser and navigate to `http://localhost:3000`

## 📝 License
MIT
