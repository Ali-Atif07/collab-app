
#  Collab-App – Real-Time Collaborative Editor

CollabApp is a **Google Docs–style real-time collaboration platform** built using **React, Node.js, Express, and WebSockets (Socket.IO)**.  

It allows multiple users to join a shared room and edit documents **simultaneously with instant synchronization, live cursor presence, and active user indicators**.

---

## ✨ Key Features
- 📝 **Real-Time Text Collaboration**
  - Multiple users can edit the same document at the same time
  - Instant updates using WebSocket-based communication

- 👥 **Live User Presence**
  - Displays currently active users in a room
  - Real-time join and leave updates

- 🖱️ **Live Cursor Tracking**
  - Shows cursor positions of other users
  - User identity attached to cursor movement

- 🏠 **Room-Based Document Architecture**
  - Each document is isolated using a unique room ID
  - Enables multiple documents to be edited concurrently

- ⚡ **Performance Optimizations**
  - Throttling applied to editor updates to minimize network traffic
  - Efficient delta-based text synchronization

- 🔄 **Automatic State Sync**
  - New users receive the current document state instantly
  - Document state persists while users are connected

---

## 🧠 System Design Overview

### Frontend
- Built with **React 18** and **Vite** for fast development and optimized builds
- **Quill Editor** for rich-text editing
- **Socket.IO Client** for real-time communication
- Optimized editor updates using throttling

### Backend
- **Node.js + Express** server
- **Socket.IO** for bidirectional WebSocket communication
- In-memory storage for rooms and documents
- Event-driven architecture for scalability

---

## 🛠️ Tech Stack

### Frontend (`/client`)
- React
- Vite
- Socket.IO Client
- React Quill
- Lodash Throttle
- UUID
- React Hot Toast

### Backend (`/server`)
- Node.js
- Express
- Socket.IO
- CORS

---

## 📁 Project Structure

```

collabapp/
│
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── index.html
│   └── package.json
│
├── server/                 # Node.js backend
│   ├── server.js
│   └── package.json
│
└── README.md

````

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Ali-Atif07/collab-app.git
cd collab-app
````

### 2️⃣ Start the Backend Server

```bash
cd server
npm install
npm run dev
```

Server runs on **[http://localhost:5000](http://localhost:5000)**

### 3️⃣ Start the Frontend

```bash
cd client
npm install
npm run dev
```

Frontend runs on **[http://localhost:3000](http://localhost:3000)**

---

## 🔌 WebSocket Events

| Event Name        | Description                       |
| ----------------- | --------------------------------- |
| `join-room`       | User joins a document room        |
| `send-changes`    | Sends editor text changes         |
| `receive-changes` | Receives updates from other users |
| `cursor-move`     | Broadcasts cursor position        |
| `active-users`    | Updates list of connected users   |
| `save-document`   | Saves document state              |

---

## 🧪 Health Check API

```http
GET /health
```

Example Response:

```json
{
  "status": "ok",
  "activeRooms": 1,
  "totalDocuments": 1
}
```

---

## 🚀 Why This Project Matters

This project demonstrates real-world engineering skills such as:

* Designing real-time collaboration systems
* Managing concurrent users efficiently
* Handling shared state synchronization
* Optimizing performance for frequent updates

The architecture and communication patterns are similar to applications like **Google Docs, Notion, and Figma**.

---
