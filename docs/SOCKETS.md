## Socket.IO Events

Namespace: default (`/`). Each client authenticates by connecting with `auth: { token: <JWT> }`.

### Client → Server

| Event              | Payload                                            | Purpose |
| ------------------ | -------------------------------------------------- | ------- |
| `join-wifi`        | `{ subnet?, ipAddress?, ssid? }`                   | Join/create WiFi group based on subnet or IP |
| `leave-wifi`       | `{ subnet }`                                       | Leave current WiFi room |
| `get-wifi-users`   | —                                                  | Request latest WiFi roster + group info (response is unicast) |
| `send-message`     | `{ recipientId, content, fileUrl?, fileName?, fileSize?, messageType? }` | Send a DM (AES-encrypted server-side) |
| `send-group-message` | `{ wifiGroupId, content, fileUrl?, ... }`       | Broadcast to WiFi channel |
| `typing`           | `{ recipientId, isTyping }`                        | DM typing indicator |
| `typing-group`     | `{ subnet, isTyping }`                             | WiFi channel typing indicator |
| `mark-read`        | `{ messageId }`                                    | Mark DM as read (+notify sender) |
| `friend-request-sent` | `{ recipientId, requestId }`                   | Notify recipient after REST friend request succeeds |

### Server → Client

| Event                  | Payload                                                        | Notes |
| ---------------------- | -------------------------------------------------------------- | ----- |
| `wifi-group-joined`    | `{ wifiGroup }`                                               | Sent directly after `join-wifi` |
| `wifi-group-update`    | `{ wifiGroup }`                                               | Broadcast + unicast for roster sync |
| `wifi-users-update`    | `{ subnet, users: [...] }`                                    | Real-time user list (excludes current user) |
| `user-joined-network`  | `{ user, wifiGroup }`                                         | Room broadcast |
| `user-left-network`    | `{ userId, username }`                                        | Room broadcast |
| `receive-message`      | `<Message>`                                                   | New DM for recipient |
| `receive-group-message`| `<Message>`                                                   | WiFi channel broadcast |
| `message-sent`         | `<Message>`                                                   | Acknowledgement back to sender |
| `user-typing`          | `{ userId, username, isTyping }`                              | DM typing indicator |
| `user-typing-group`    | `{ userId, username, isTyping }`                              | WiFi typing indicator |
| `message-read`         | `{ messageId, readBy, readAt }`                               | DM read receipts |
| `friend-request-received` | `{ requestId, sender }`                                   | Real-time friend notification |
| `error`                | `{ message }`                                                 | Generic error channel |

### Lifecycle

1. Client logs in → `socketService.connect(token)` (frontend)
2. Once connected, dashboard calls `join-wifi` (with subnet from `/wifi/users`)
3. WiFi membership updates trigger `wifi-group-update` + `wifi-users-update`
4. Messaging UIs:
   - Load history via REST (`/messages/...`)
   - Stream realtime updates through `receive-message` / `receive-group-message`
   - Send attachments via `/messages/attachments` before emitting socket events
5. On logout/disconnect the backend marks the user offline, updates WiFi group membership, and emits `user-left-network` plus a fresh roster snapshot.***

