# Quick Start Guide - We-Connect-Fi

## 🚀 Setup Instructions

### 1. Backend Setup

```bash
cd backend
npm install
```

Create `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/we-connect-fi
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
MESSAGE_SECRET=your-message-encryption-key-change-this
CLIENT_URL=http://localhost:5173
NODE_ENV=development
ALLOW_LOOPBACK=true
```

Start backend:
```bash
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your-google-client-id (optional)
```

Start frontend:
```bash
npm run dev
```

### 3. MongoDB Setup

Make sure MongoDB is running:
```bash
# Check if MongoDB is running
mongosh "mongodb://localhost:27017/we-connect-fi"
```

## ✅ All Bugs Fixed

### Fixed Issues:
1. ✅ Registration FormData parsing
2. ✅ API base URL configuration
3. ✅ WiFi auto-join on dashboard
4. ✅ Message display (content/text field handling)
5. ✅ Socket error handling for localhost
6. ✅ WiFi state emission on join

## 🧪 Testing Your App

### Test Registration:
1. Go to `http://localhost:5173/register`
2. Complete all 6 steps
3. Submit - should redirect to dashboard
4. Check MongoDB: `db.users.find().pretty()`

### Test Login:
1. Go to `http://localhost:5173/login`
2. Use registered credentials
3. Should redirect to dashboard
4. Socket should connect (check console)

### Test WiFi Features:
1. Open `/app/wifi-users` in two different browsers
2. Both should see each other (if on same network)
3. Send messages in group chat
4. Test friend requests

### Test Messaging:
1. Go to `/app/chats`
2. Select a friend
3. Send messages
4. Test file uploads
5. Check typing indicators

## 📝 Important Notes

- **MongoDB**: Database name is `we-connect-fi` (with hyphens)
- **Localhost Testing**: Set `ALLOW_LOOPBACK=true` in backend `.env` for local testing
- **Google OAuth**: Optional - app works without it
- **WiFi Detection**: Works best on actual local networks, not localhost

## 🐛 Troubleshooting

### Registration fails:
- Check backend console for errors
- Verify MongoDB is running
- Check `.env` file has correct `MONGODB_URI`

### Login returns 401:
- Verify user exists: `db.users.find().pretty()`
- Check password is correct
- Verify JWT_SECRET is set in backend `.env`

### Socket not connecting:
- Check `VITE_SOCKET_URL` in frontend `.env`
- Verify backend is running on port 5000
- Check browser console for connection errors

### WiFi features not working:
- Ensure `ALLOW_LOOPBACK=true` for localhost testing
- For real networks, ensure multiple users on same subnet
- Check backend console for WiFi join errors

## 📚 Documentation

See `docs/` folder for:
- `API.md` - API endpoints
- `SOCKETS.md` - Socket events
- `DEPLOYMENT.md` - Production deployment
- `MOCKUPS.md` - UI mockups

