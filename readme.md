## We-Connect-Fi Overview

We-Connect-Fi is a futuristic, WiFi-aware messenger for students in campus or hostel networks. The stack is React + Vite + Tailwind on the frontend and Node.js + Express + MongoDB + Socket.IO on the backend. Real-time sockets drive DMs, WiFi group chat, typing states, read receipts, device presence, and live WiFi rosters. Users authenticate through a multi-step form or Google OAuth, manage friends, and chat with everyone sharing the same subnet.

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




