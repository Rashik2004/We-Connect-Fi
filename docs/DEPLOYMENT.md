## Deployment Guide

### 1. Environment Variables

Backend (`backend/.env`):

```
NODE_ENV=production
PORT=5000
CLIENT_URL=https://app.we-connect-fi.com
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/weconnectfi
JWT_SECRET=<strong-random-secret>
MESSAGE_SECRET=<separate-secret-for-AES>
ALLOW_LOOPBACK=false           # optional, true for local dev
```

Frontend (`frontend/.env`):

```
VITE_API_URL=https://api.we-connect-fi.com/api
VITE_SOCKET_URL=https://api.we-connect-fi.com
VITE_GOOGLE_CLIENT_ID=<oauth-client-id>
```

### 2. Install Dependencies

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 3. Build & Run

**Backend (production)**
```bash
cd backend
npm run start           # uses server.js with Socket.IO + cron
```

**Frontend**
```bash
cd frontend
npm run build
npm run preview        # or deploy `dist/` to static hosting (Vercel/Netlify/S3)
```

For containerized deploys, expose `PORT` 5000, mount `uploads/`, and serve frontend dist via CDN.

### 4. Reverse Proxy / SSL

- Terminate TLS at Nginx/Traefik.
- Proxy `/api` and `/socket.io` to the Node backend.
- Serve the Vite build via CDN or the same proxy root.

### 5. Cron & Background Jobs

The backend registers an hourly cron (`node-cron`) to prune inactive WiFi groups. Ensure the process stays alive (PM2, systemd, Docker) so cron runs.

### 6. File Storage

- Avatars → `uploads/avatars`
- Message attachments → `uploads/attachments`

For production, consider offloading to S3/GCS; update `upload.js` destinations accordingly and keep `/uploads` route mapping.

### 7. Security Checklist

- Use HTTPS everywhere (cookies + sockets).
- Set strong `JWT_SECRET` and `MESSAGE_SECRET`.
- Configure Helmet/CORS origins (`CLIENT_URL`).
- Enable MongoDB access lists / TLS.
- Configure Google OAuth consent screen + redirect URIs.

### 8. Monitoring

- Cloud logs for Express + Socket.IO events.
- Track rate-limit rejections.
- Add uptime monitoring against `/api/health`.

### 9. Scaling

- Run Socket.IO with sticky sessions (e.g., Nginx `ip_hash` or Redis adapter).
- Move session broadcasts to Redis if scaling horizontally.
- Leverage MongoDB Atlas with proper indexes (already defined on `Message`, `FriendRequest`, `WiFiGroup`).

