# Real-Time Pair Programming - Frontend

React + TypeScript + Redux Toolkit frontend for real-time collaborative coding.

## 🚀 Features

- **Real-time Code Synchronization** via WebSockets
- **Monaco Editor** - Same editor as VS Code
- **Redux Toolkit** for state management
- **AI Autocomplete** hints
- **Responsive Design**
- **TypeScript** for type safety

## 📋 Prerequisites

- Node.js 18+ and npm
- Backend server running on http://localhost:8000

## 🛠️ Installation

```bash
cd frontend
npm install
```

## 🏃 Running the Application

### Development Mode

```bash
npm run dev
```

The application will start at **http://localhost:3000**

### Production Build

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/          # React components
│   │   ├── Header.tsx       # Top navigation bar
│   │   ├── RoomSelector.tsx # Room creation/join UI
│   │   ├── CodeEditor.tsx   # Monaco code editor
│   │   └── Sidebar.tsx      # Info and activity panel
│   ├── store/               # Redux store
│   │   ├── index.ts         # Store configuration
│   │   └── slices/          # Redux slices
│   │       ├── roomSlice.ts
│   │       ├── editorSlice.ts
│   │       └── websocketSlice.ts
│   ├── hooks/               # Custom React hooks
│   │   ├── useRedux.ts      # Typed Redux hooks
│   │   └── useWebSocket.ts  # WebSocket connection hook
│   ├── services/            # API services
│   │   └── api.ts           # Axios API client
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🔧 Configuration

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
```

## 🎯 Usage

1. **Start the backend** server first (see backend README)
2. **Start the frontend**: `npm run dev`
3. **Open** http://localhost:3000 in your browser
4. **Create a room** or **join existing room**
5. **Share the Room ID** with collaborators
6. **Start coding together!**

## 🧪 Testing

Open the application in multiple browser windows with the same Room ID to test real-time collaboration.

## 🏗️ Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Redux Toolkit** - State management
- **Monaco Editor** - Code editor (VS Code editor)
- **Vite** - Build tool and dev server
- **Axios** - HTTP client

## 📦 Dependencies

### Core

- `react` - React library
- `react-dom` - React DOM
- `@reduxjs/toolkit` - Redux with less boilerplate
- `react-redux` - React bindings for Redux
- `@monaco-editor/react` - Monaco editor component
- `axios` - Promise-based HTTP client

### Dev Dependencies

- `vite` - Next generation frontend tooling
- `@vitejs/plugin-react` - Vite React plugin
- `typescript` - TypeScript compiler
- `@types/react` - React type definitions
- `@types/react-dom` - React DOM type definitions

## 🎨 Features in Detail

### Real-Time Collaboration

- WebSocket connection to backend
- Automatic reconnection on disconnect
- Live code synchronization
- User presence indicators

### Code Editor

- Syntax highlighting for Python, JavaScript, TypeScript
- Auto-completion
- Line numbers
- Minimap
- Dark theme

### AI Autocomplete

- 600ms debounce
- Confidence scoring
- Visual hint display
- Auto-hide after 5 seconds

### Redux State Management

- **Room Slice**: Room ID, connection status, user count
- **Editor Slice**: Code content, cursor position, suggestions
- **WebSocket Slice**: Connection state, messages, errors

## 🚀 Build for Production

```bash
npm run build
```

Output will be in the `dist/` directory. Deploy this to any static hosting service.

## 📝 Notes

- Frontend proxies API requests to backend (configured in vite.config.ts)
- WebSocket reconnection is automatic
- State persists during WebSocket reconnections
- Monaco Editor loads from CDN

## 🐛 Troubleshooting

**Can't connect to backend:**

- Ensure backend is running on port 8000
- Check CORS settings in backend
- Verify environment variables

**WebSocket connection failed:**

- Check backend WebSocket endpoint is accessible
- Ensure no firewall blocking WS connections
- Check browser console for errors

**Editor not loading:**

- Check browser console for Monaco loader errors
- Ensure internet connection (Monaco loads from CDN)
- Try clearing browser cache

## 📄 License

Part of Real-Time Pair Programming Application submission.

---

**Built with ❤️ for Tredence Full-Stack Python API Developer Position**
