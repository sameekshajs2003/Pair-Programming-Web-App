# Real-Time Pair Programming Application

**Submitted by:** Sameeksha J S  

---

A simplified real-time collaborative coding platform built with FastAPI and WebSockets. Two or more users can join the same room, edit code simultaneously, and see each other's changes instantly.

## 🎯 Features Implemented

- ✅ **Room Creation & Joining**: Create unique rooms with room IDs
- ✅ **Real-Time Collaboration**: WebSocket-based instant code synchronization
- ✅ **AI Autocomplete**: Mocked autocomplete suggestions (rule-based)
- ✅ **Persistent Storage**: PostgreSQL database for room and code state
- ✅ **No Authentication**: Simple, frictionless collaboration
- ✅ **Clean Architecture**: Organized routers, services, and models structure
- ✅ **Full Frontend**: React + TypeScript + Redux Toolkit (Optional - Included)
- ✅ **Docker Support**: Easy deployment with Docker Compose

## 🏗️ Architecture & Design Choices

### Backend Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application entry point
│   ├── database.py          # Database configuration and session management
│   ├── models.py            # SQLAlchemy models (Room, CodeState)
│   ├── schemas.py           # Pydantic schemas for validation
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── rooms.py         # Room creation and retrieval endpoints
│   │   ├── autocomplete.py  # Autocomplete endpoint
│   │   └── websocket.py     # WebSocket endpoint for real-time sync
│   └── services/
│       ├── __init__.py
│       ├── room_service.py      # Room management logic
│       └── autocomplete_service.py  # Autocomplete logic
├── requirements.txt
├── Dockerfile
├── test_api.py              # API endpoint tests
├── test_websocket.py        # WebSocket tests
└── .env.example
```

### Frontend Structure (Optional - Included)

```
frontend/
├── src/
│   ├── components/          # React components (CodeEditor, RoomSelector, etc.)
│   ├── hooks/              # Custom hooks (useWebSocket, useRedux)
│   ├── store/              # Redux store and slices
│   └── services/           # API client
├── package.json
├── Dockerfile
└── vite.config.ts
```

### Technology Stack

**Backend:**

- **FastAPI**: Modern, fast web framework for building APIs
- **WebSockets**: Real-time bidirectional communication
- **SQLAlchemy**: SQL toolkit and ORM
- **PostgreSQL**: Relational database for persistent storage
- **Pydantic**: Data validation using Python type annotations
- **Uvicorn**: ASGI server

**Frontend:**

- **React 18**: Modern UI library
- **TypeScript**: Type-safe JavaScript
- **Redux Toolkit**: State management
- **Monaco Editor**: VS Code's code editor
- **Vite**: Fast build tool and dev server
- **Axios**: HTTP client

### Key Design Decisions

1. **WebSocket Architecture**:

   - Implemented a `ConnectionManager` class to handle multiple WebSocket connections per room
   - Broadcasts changes to all clients except the sender to avoid echo
   - Maintains connection state in memory for fast lookups
   - Handles user join/leave events with connection counting

2. **Database Schema**:

   - `Room` table: Stores room metadata (ID, timestamps)
   - `CodeState` table: Stores current code for each room (one-to-one relationship)
   - Room IDs are shortened UUIDs (8 characters) for easier sharing
   - PostgreSQL chosen for ACID compliance and scalability

3. **Autocomplete Service**:

   - Rule-based pattern matching (no actual AI as per requirements)
   - Supports Python and JavaScript with common code patterns
   - Returns confidence scores for realistic simulation
   - 600ms debounce on frontend to reduce API calls

4. **Concurrency Handling**:

   - Last-write-wins strategy for simplicity
   - Database updates on every code change for persistence
   - WebSocket broadcasts are asynchronous and non-blocking

5. **Clean Architecture**:
   - Separation of concerns: routers (HTTP layer) → services (business logic) → models (data layer)
   - Dependency injection for database sessions
   - Pydantic schemas for request/response validation

## 🚀 How to Run

### Prerequisites

- Python 3.11+
- PostgreSQL 15+
- Node.js 18+ (for frontend, optional)
- Docker & Docker Compose (optional, for containerized setup)

### Option 1: Docker Setup (Recommended - Fastest)

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   ```

2. **Start all services with Docker Compose**:

   ```bash
   docker-compose up --build
   ```

3. **Access the application**:
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs
   - Frontend (if included): http://localhost:5173

### Option 2: Local Backend Setup

1. **Install and start PostgreSQL**:

   - Create a database named `pairprog`

2. **Set up Python environment**:

   ```bash
   cd backend
   python -m venv venv

   # Windows
   venv\Scripts\activate

   # Linux/Mac
   source venv/bin/activate
   ```

3. **Install dependencies**:

   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment** (optional):

   ```bash
   # Default DATABASE_URL: postgresql://postgres:postgres@localhost:5432/pairprog
   # Create .env file if you need custom settings
   ```

5. **Run the backend**:

   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

6. **Access the API**:
   - API: http://localhost:8000
   - Interactive Docs: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

### Option 3: Windows Quick Setup

Run the automated setup script:

```bash
setup.bat
```

## 📡 API Endpoints

### REST Endpoints

#### 1. Create Room

```http
POST /api/rooms
```

**Response:**

```json
{
  "roomId": "a1b2c3d4",
  "created_at": "2025-11-28T10:30:00"
}
```

#### 2. Get Room Info

```http
GET /api/rooms/{room_id}
```

**Response:**

```json
{
  "roomId": "a1b2c3d4",
  "created_at": "2025-11-28T10:30:00",
  "code": "# Welcome to the collaborative coding room!\n",
  "language": "python"
}
```

#### 3. Autocomplete

```http
POST /api/autocomplete
```

**Request Body:**

```json
{
  "code": "def ",
  "cursorPosition": 4,
  "language": "python"
}
```

**Response:**

```json
{
  "suggestion": "def function_name(parameter):\n    pass",
  "confidence": 0.85,
  "description": "Auto-complete for def"
}
```

### WebSocket Endpoint

#### Connect to Room

```
ws://localhost:8000/ws/{room_id}
```

**Message Types:**

1. **Initial State (Server → Client)**:

```json
{
  "type": "init",
  "code": "# Initial code",
  "language": "python",
  "connectionCount": 1
}
```

2. **Code Update (Client → Server)**:

```json
{
  "type": "code_update",
  "code": "# Updated code",
  "cursorPosition": 10,
  "userId": "user123",
  "language": "python"
}
```

3. **Code Update Broadcast (Server → Clients)**:

```json
{
  "type": "code_update",
  "code": "# Updated code",
  "cursorPosition": 10,
  "userId": "user123",
  "timestamp": "2025-11-28T10:35:00"
}
```

4. **User Joined (Server → Clients)**:

```json
{
  "type": "user_joined",
  "connectionCount": 2,
  "timestamp": "2025-11-28T10:35:00"
}
```

5. **User Left (Server → Clients)**:

```json
{
  "type": "user_left",
  "connectionCount": 1,
  "timestamp": "2025-11-28T10:40:00"
}
```

## 🧪 Testing the Application

### Option 1: Test with Full Frontend (Recommended)

Experience the complete application with the React frontend:

1. **Start the Backend**:

   ```bash
   # Terminal 1 - Start PostgreSQL and Backend
   cd backend
   python -m venv venv
   venv\Scripts\activate    # Windows
   # source venv/bin/activate  # Linux/Mac
   pip install -r requirements.txt
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

2. **Start the Frontend**:

   ```bash
   # Terminal 2 - Start Frontend
   cd frontend
   npm install
   npm run dev
   ```

3. **Test Real-Time Collaboration**:

   - Open browser: http://localhost:5173
   - Click **"Create Room"** button
   - Copy the generated Room ID
   - Open a **second browser window** (or incognito mode)
   - Paste the Room ID and click **"Join Room"**
   - Start typing in the code editor in either window
   - **Watch real-time synchronization** between both windows!

4. **Test Autocomplete**:

   - In the code editor, type: `def `
   - Wait ~600ms
   - See autocomplete suggestion appear at the top
   - Try other patterns: `for `, `class `, `if `, etc.

5. **Verify Features**:
   - ✅ Real-time code synchronization
   - ✅ User count updates (shown in sidebar)
   - ✅ Autocomplete suggestions
   - ✅ Connection status indicators
   - ✅ Room ID sharing

**Using Docker (Easiest)**:

```bash
# Start everything with one command
docker-compose up --build

# Frontend: http://localhost:5173
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### Option 2: Test with Provided Scripts

```bash
# Start the backend first, then:
cd backend
python test_api.py
python test_websocket.py
```

### Option 3: Manual Testing with Postman

Import `Postman_Collection.json` or test manually:

1. **Create a Room**:

   - Method: POST
   - URL: `http://localhost:8000/api/rooms`
   - Copy the `roomId` from response

2. **Test Autocomplete**:

   - Method: POST
   - URL: `http://localhost:8000/api/autocomplete`
   - Body (JSON):

   ```json
   {
     "code": "for ",
     "cursorPosition": 4,
     "language": "python"
   }
   ```

3. **Test WebSocket**:
   - Open WebSocket connection to: `ws://localhost:8000/ws/{room_id}`
   - Send code update:
   ```json
   {
     "type": "code_update",
     "code": "print('Hello World')",
     "userId": "test-user"
   }
   ```

## 🔧 Configuration

Environment variables (`.env`):

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/pairprog
HOST=0.0.0.0
PORT=8000
```

## 📊 Database Schema

```sql
-- Rooms table
CREATE TABLE rooms (
    id VARCHAR PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Code states table
CREATE TABLE code_states (
    id VARCHAR PRIMARY KEY,
    room_id VARCHAR UNIQUE REFERENCES rooms(id),
    code TEXT DEFAULT '',
    language VARCHAR DEFAULT 'python',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🚧 Known Limitations

1. **Concurrency**: Last-write-wins strategy can cause race conditions with simultaneous edits (acceptable for prototype)
2. **Scalability**: In-memory WebSocket connections won't scale across multiple server instances without Redis
3. **No Conflict Resolution**: No operational transformation or CRDT for proper conflict resolution
4. **No Authentication**: Anyone with a room ID can join (as per requirements)
5. **No Edit History**: Only current state is stored, no version control
6. **Limited Autocomplete**: Simple rule-based matching, not real AI (as per requirements)
7. **No Rate Limiting**: API endpoints are not rate-limited

## 🎯 What I Would Improve with More Time

### 1. **Operational Transformation (OT) or CRDT**

- Implement proper conflict resolution for simultaneous edits
- Use libraries like Yjs or Automerge for collaborative editing
- Handle cursor positions and selections properly

### 2. **Real AI Autocomplete**

- Integrate with OpenAI Codex, GitHub Copilot API, or local models
- Context-aware suggestions based on imports and file type
- Support for multiple programming languages

### 3. **Scalability & Production-Readiness**

- **Redis** for WebSocket state management across instances
- **Message Queue** (RabbitMQ/Kafka) for reliable message delivery
- **Horizontal scaling** with load balancer
- **Rate limiting** and DDoS protection
- **CDN integration** for static assets

---
