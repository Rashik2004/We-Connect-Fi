## We-Connect-Fi Overview

We-Connect-Fi is a futuristic, WiFi-aware messenger for students in campus or hostel networks. The stack is React + Vite + Tailwind on the frontend and Node.js + Express + MongoDB + Socket.IO on the backend. Real-time sockets drive DMs, WiFi group chat, typing states, read receipts, device presence, and live WiFi rosters. Users authenticate through a multi-step form or Google OAuth, manage friends, and chat with everyone sharing the same subnet.

### Folder Structure

- `backend/`
  - `server.js` – Express app, middleware, Socket.IO bootstrapping, cron jobs
  - `src/config/database.js` – Mongo connection helper
  - `src/models/` – `User`, `FriendRequest`, `Message`, `WiFiGroup`
  - `src/controllers/` – Auth, friends, WiFi, and message controllers
  - `src/routes/` – Express routers (`auth`, `friends`, `wifi`, `messages`)
  - `src/socket/socketHandler.js` – Real-time events (DMs, WiFi presence, typing, read receipts)
  - `src/services/wifiService.js` – WiFi group lifecycle, member tracking, cleanup
  - `src/utils/` – Network detection + message encryption helpers
  - `src/middleware/` – Auth guard and file-upload (multer) configs
  - `uploads/` – Persisted avatars/attachments (served via `/uploads`)

- `frontend/`
  - `src/components/landing` – Neon/glassmorphic landing page with hero & sections
  - `src/components/auth` – Multi-step register + Google-enabled login
  - `src/components/app` – Dashboard shell, chat UI, WiFi roster, profile, friends
  - `src/components/ui` – Tailwind-based primitives (Button, Card, Input, Avatar, Badge, Modal)
  - `src/services/` – Axios wrappers (`api.js`) + Socket singleton (`socket.js`)
  - `src/stores/` – Zustand stores for auth (token persistence) and theming
  - `src/styles/` – Global Tailwind styles & neon utility classes

- `docs/` – Product + engineering references (`README`, `API`, `SOCKETS`, `DEPLOYMENT`, `MOCKUPS`)

### Database Collections

- `users`
  - Identity: `username`, `email`, `password` (bcrypt), `googleId`
  - Profile: `avatar`, `bio`, `status`, `deviceInfo`, `privacySettings`, `blockedUsers`
  - Presence: `isOnline`, `lastSeen`, `currentNetwork`, `networkHistory`
  - Graph: `friends` (ObjectId refs)

- `friendrequests`
  - `sender`, `recipient`, `status`, optional `message`
  - Indexed for fast lookups (`sender+recipient`, `recipient+status`)

- `messages`
  - `sender`, `recipient` (DM) or `wifiGroup` (channel)
  - `content`, `encryptedContent`, `messageType`, file metadata
  - `readBy`, `replyTo`, soft-delete flags

- `wifigroups`
  - `name`, `subnet`, `ssid`, `members[]`, `activeMembers`, `lastActivity`, `metadata`
  - Each member entry tracks `joinedAt` + `isActive`

### Core Flows

1. **Authentication**
   - Six-step onboarding (username, email, password, DOB, bio, avatar upload)
   - Google OAuth via `@react-oauth/google`
   - JWT sessions with protected endpoints

2. **WiFi Awareness**
   - Backend infers subnet from IP/headers; client optionally hints a subnet
   - `wifiService` auto-creates temporary WiFi groups and tracks membership history
   - Sockets join `wifi:${subnet}` rooms, emit live rosters, and clean up on disconnect

3. **Messaging**
   - REST endpoints (`/api/messages`) deliver paginated chat history + attachment uploads
   - Socket events stream new DMs, group messages, typing states, and read receipts
   - Messages store encrypted payloads (`MESSAGE_SECRET`-driven AES) plus metadata

4. **Friend Graph**
   - RESTful friend requests (send, accept, decline, remove)
   - Friends dashboard showing pending requests and online/offline status
   - WiFi roster shows add-friend/message actions gated by privacy settings

5. **UI / UX**
   - Futuristic neon/glass aesthetic with animations (Framer Motion + Tailwind)
   - System-theme detection + toggle via Zustand store
   - Landing page with hero, features, how-it-works, security, CTA, and footer
   - WiFi page combines live roster cards with an embedded group chat window

Use the accompanying docs for detailed API shapes, socket contracts, deployment, and mockup notes.***

