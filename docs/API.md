## REST API Reference

Base URL: `https://<backend-domain>/api`

All endpoints (except public auth) require `Authorization: Bearer <JWT>`.

### Auth

| Method | Route            | Description                         | Body                                                                 |
| ------ | ---------------- | ----------------------------------- | -------------------------------------------------------------------- |
| POST   | `/auth/register` | Multi-step signup with avatar upload | `FormData` fields: `username`, `email`, `password`, `dateOfBirth`, `bio`, optional `avatar` file |
| POST   | `/auth/login`    | Email/password login                | `{ "email": "user@campus.edu", "password": "secret" }`                |
| POST   | `/auth/google`   | Google OAuth callback               | `{ googleId, email, username, avatar }` (decoded client-side)        |
| GET    | `/auth/me`       | Current user profile + friends      | none                                                                 |
| POST   | `/auth/logout`   | Marks user offline & clears session | none                                                                 |

### Friends

| Method | Route                       | Description                                | Body |
| ------ | --------------------------- | ------------------------------------------ | ---- |
| POST   | `/friends/request`          | Send friend request (privacy-aware)        | `{ "recipientId": "<userId>", "message": "Hi!" }` |
| GET    | `/friends/requests`         | Pending friend requests (incoming)         | —    |
| PUT    | `/friends/accept/:requestId`| Accept a request                           | —    |
| PUT    | `/friends/decline/:requestId`| Decline a request                         | —    |
| GET    | `/friends`                  | List of accepted friends (online metadata) | —    |
| DELETE | `/friends/:friendId`        | Remove a friend                            | —    |

### WiFi Awareness

| Method | Route        | Description                                                | Response                                                                |
| ------ | ------------ | ---------------------------------------------------------- | ----------------------------------------------------------------------- |
| GET    | `/wifi/users`| List other visible users on same subnet, plus subnet id    | `{ subnet, users: [{ _id, username, avatar, deviceInfo, isFriend, joinedAt }] }` |
| GET    | `/wifi/group`| WiFi group metadata inferred from requester subnet         | `{ wifiGroup: { _id, name, subnet, activeMembers, members[...] } }`     |

### Messages

| Method | Route                       | Description                             | Notes |
| ------ | --------------------------- | --------------------------------------- | ----- |
| GET    | `/messages/direct/:userId`  | Paginated DM history (`limit`, `before`) | Returns chronological array of populated messages |
| GET    | `/messages/group/:groupId`  | Paginated WiFi-channel history          | Same query params supported                                              |
| POST   | `/messages/attachments`     | Upload chat attachment (images/files)   | `multipart/form-data` with `file`; response provides CDN URL             |
| DELETE | `/messages/:messageId`      | Soft-delete own message                 | Only sender can delete                                                   |

### Health

| Method | Route       | Description                    |
| ------ | ----------- | ------------------------------ |
| GET    | `/health`   | Basic uptime/service heartbeat |

### Common Response Shape

```json
{
  "success": true,
  "data": "...",
  "message": "Optional human-readable string"
}
```

Errors use HTTP status codes with `{ success: false, message }`. Rate limiting applies globally to `/api/*` (100 req/15 min).***

