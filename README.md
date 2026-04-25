# 🚀 CodeIt - Real-Time Coding Interview Platform

CodeIt is a full-stack real-time coding interview platform that enables two users to collaborate in a shared coding environment with live code synchronization, chat, and video communication.

---

## 🌟 Features

* 💻 **Real-time Code Editor** (Monaco Editor)
* 🔄 **Live Code Synchronization** using Socket.IO
* 💬 **Instant Chat System** with usernames
* 🎥 **Video & Audio Calling** using WebRTC
* ⚡ **Code Execution Support** (Python & JavaScript)
* 🔐 **User Authentication** (JWT + bcrypt)
* 🔗 **Room-Based Interview System**
* 🎨 **VS Code–inspired UI**

---

## 🛠️ Tech Stack

### Frontend

* React
* Monaco Editor
* Socket.IO Client

### Backend

* Flask
* Flask-SocketIO
* SQLite

### Real-Time & Communication

* Socket.IO
* WebRTC

---

## 📁 Project Structure

```
CodeIt/
│
├── frontend/        # React app
├── backend/         # Flask server
│   ├── routes/
│   ├── sockets/
│   ├── models.py
│   └── app.py
│
└── README.md
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repository

```
git clone https://github.com/YOUR_USERNAME/CodeIt.git
cd CodeIt
```

---

### 2️⃣ Backend Setup

```
cd backend
pip install -r requirements.txt
python app.py
```

Backend will run on:

```
http://localhost:5000
```

---

### 3️⃣ Frontend Setup

Open a new terminal:

```
cd frontend
npm install
npm start
```

Frontend will run on:

```
http://localhost:3000
```

---

## 🚀 Usage

1. Enter your name on the home page
2. Click **Start Interview** or join using a Room ID
3. Share the Room ID with another user
4. Collaborate in real-time:

   * Write code together
   * Chat instantly
   * Run code
   * Start video call

---

## 🧠 Key Concepts Implemented

* Real-time communication using WebSockets (Socket.IO)
* Peer-to-peer media streaming using WebRTC
* REST APIs for authentication and code execution
* Room-based event handling for multi-user sessions

---

## 🎯 Future Improvements

* Screen sharing
* Code persistence
* Multi-user support
* Better UI/UX enhancements

---

## 👨‍💻 Author

Your Name
GitHub: https://github.com/Mayanknegi24

---

## ⭐ If you like this project

Give it a ⭐ on GitHub!
