# Version 2.0 Phase 18 Real-Time Collaboration & Live Streaming Architecture

---

## 1. Executive Architecture Overview

Dashboard Capsule AI Version 2.0 Phase 18 introduces the **Real-Time Collaboration & Live Streaming Platform** (`services/realtime-service`). This service enables simultaneous multi-user dashboard filtering, live presence tracking, presenter mode streaming, live cursor overlays, threaded comments with `@user` mentions, and interactive session replay timelines.

```mermaid
graph TD
    ClientA[User A (Presenter)] -->|WebSocket Frame| Hub[Realtime Connection Hub :8087]
    ClientB[User B (Collaborator)] -->|WebSocket Frame| Hub
    ClientC[User C (Viewer)] -->|WebSocket Frame| Hub

    subgraph services/realtime-service
        Hub --> PresSync[Presence & Live Cursor Tracker]
        Hub --> EvtEngine[Realtime Sync Engine]
        Hub --> ReplayStore[Session Replay Timeline Buffer]
        EvtEngine --> CommentStore[Threaded Comment & Mention Store]
    end

    Hub -->|Broadcast Frame| ClientA & ClientB & ClientC
```

---

## 2. Real-Time Synchronization Capabilities

1. **Live Presence & Cursors**: Synchronizes active user avatars, role badges, current dashboard page, and real-time cursor positions (`cursorX`, `cursorY`) across all open viewer clients.
2. **Presenter Mode**: Allows an owner/presenter to broadcast page changes, zoom/pan states, slicers, and bookmark states to all followers.
3. **Threaded Comments & Mentions**: Supports inline visual commentary, `@user` notification triggers, and thread resolution workflows.
4. **Interactive Session Replay**: Captures raw timestamped interaction frames for playback, timeline scrubbing, and historical auditing.

---

## 3. REST API v2 Specifications

- `POST /api/v2/realtime/session` — Create or join a live collaboration room.
- `GET /api/v2/realtime/status` — Health, active WebSocket count, and broadcasting metrics.
- `POST /api/v2/comments` — Post a live comment thread with mentions.
- `GET /api/v2/comments` — Retrieve all active comment threads for a dashboard.
- `POST /api/v2/notifications` — Dispatch real-time user notification.
- `GET /api/v2/presence` — Query online collaborators, avatars, and live cursor positions.
- `GET /api/v2/realtime/replay` — Export timestamped interaction frames for session replay.
