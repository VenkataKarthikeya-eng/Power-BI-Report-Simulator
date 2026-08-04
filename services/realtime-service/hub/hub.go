package hub

import (
	"encoding/json"
	"fmt"
	"sync"
	"time"
)

type EventType string

const (
	EventFilterChange    EventType = "filter_change"
	EventSlicerChange    EventType = "slicer_change"
	EventBookmarkApply   EventType = "bookmark_apply"
	EventPageNavigate    EventType = "page_navigate"
	EventCursorMove      EventType = "cursor_move"
	EventPresenterToggle EventType = "presenter_toggle"
	EventAnnotationAdd   EventType = "annotation_add"
	EventCommentAdd      EventType = "comment_add"
	EventPresenceUpdate  EventType = "presence_update"
	EventAIChatPrompt    EventType = "ai_chat_prompt"
)

type RealtimeFrame struct {
	ID          string                 `json:"id"`
	SessionID   string                 `json:"sessionId"`
	DashboardID string                 `json:"dashboardId"`
	UserID      string                 `json:"userId"`
	UserName    string                 `json:"userName"`
	EventType   EventType              `json:"eventType"`
	Payload     map[string]interface{} `json:"payload"`
	Timestamp   time.Time              `json:"timestamp"`
}

type PresenceUser struct {
	UserID    string    `json:"userId"`
	UserName  string    `json:"userName"`
	AvatarUrl string    `json:"avatarUrl"`
	Role      string    `json:"role"`
	PageID    string    `json:"pageId"`
	CursorX   float64   `json:"cursorX"`
	CursorY   float64   `json:"cursorY"`
	Status    string    `json:"status"` // ONLINE, IDLE, PRESENTING
	JoinedAt  time.Time `json:"joinedAt"`
}

type ConnectionHub struct {
	mu           sync.RWMutex
	clients      map[string]*ClientSession
	rooms        map[string]map[string]*ClientSession // dashboardID -> clientID -> session
	presence     map[string]map[string]PresenceUser  // dashboardID -> userID -> presence
	eventHistory map[string][]RealtimeFrame          // dashboardID -> timeline frames
}

type ClientSession struct {
	ID          string
	UserID      string
	UserName    string
	DashboardID string
	Send        chan []byte
}

var globalHub = NewConnectionHub()

func GetGlobalHub() *ConnectionHub {
	return globalHub
}

func NewConnectionHub() *ConnectionHub {
	return &ConnectionHub{
		clients:      make(map[string]*ClientSession),
		rooms:        make(map[string]map[string]*ClientSession),
		presence:     make(map[string]map[string]PresenceUser),
		eventHistory: make(map[string][]RealtimeFrame),
	}
}

func (h *ConnectionHub) RegisterClient(session *ClientSession) {
	h.mu.Lock()
	defer h.mu.Unlock()

	h.clients[session.ID] = session

	if _, exists := h.rooms[session.DashboardID]; !exists {
		h.rooms[session.DashboardID] = make(map[string]*ClientSession)
	}
	h.rooms[session.DashboardID][session.ID] = session

	if _, exists := h.presence[session.DashboardID]; !exists {
		h.presence[session.DashboardID] = make(map[string]PresenceUser)
	}

	h.presence[session.DashboardID][session.UserID] = PresenceUser{
		UserID:    session.UserID,
		UserName:  session.UserName,
		AvatarUrl: fmt.Sprintf("https://api.dicebear.com/7.x/avataaars/svg?seed=%s", session.UserID),
		Role:      "COLLABORATOR",
		PageID:    "Section_Q3_Overview",
		CursorX:   120.0,
		CursorY:   80.0,
		Status:    "ONLINE",
		JoinedAt:  time.Now(),
	}
}

func (h *ConnectionHub) UnregisterClient(session *ClientSession) {
	h.mu.Lock()
	defer h.mu.Unlock()

	delete(h.clients, session.ID)

	if room, exists := h.rooms[session.DashboardID]; exists {
		delete(room, session.ID)
		if len(room) == 0 {
			delete(h.rooms, session.DashboardID)
		}
	}

	if presMap, exists := h.presence[session.DashboardID]; exists {
		delete(presMap, session.UserID)
		if len(presMap) == 0 {
			delete(h.presence, session.DashboardID)
		}
	}
}

func (h *ConnectionHub) BroadcastFrame(frame RealtimeFrame) {
	h.mu.Lock()
	defer h.mu.Unlock()

	// Append to session replay timeline history
	h.eventHistory[frame.DashboardID] = append(h.eventHistory[frame.DashboardID], frame)

	// Update cursor / presence if cursor event
	if frame.EventType == EventCursorMove {
		if presMap, exists := h.presence[frame.DashboardID]; exists {
			if pres, found := presMap[frame.UserID]; found {
				if x, ok := frame.Payload["x"].(float64); ok {
					pres.CursorX = x
				}
				if y, ok := frame.Payload["y"].(float64); ok {
					pres.CursorY = y
				}
				presMap[frame.UserID] = pres
			}
		}
	}

	frameBytes, _ := json.Marshal(frame)

	if room, exists := h.rooms[frame.DashboardID]; exists {
		for _, client := range room {
			select {
			case client.Send <- frameBytes:
			default:
				close(client.Send)
				delete(room, client.ID)
			}
		}
	}
}

func (h *ConnectionHub) GetPresence(dashboardID string) []PresenceUser {
	h.mu.RLock()
	defer h.mu.RUnlock()

	var users []PresenceUser
	if presMap, exists := h.presence[dashboardID]; exists {
		for _, u := range presMap {
			users = append(users, u)
		}
	}
	return users
}

func (h *ConnectionHub) GetReplayTimeline(dashboardID string) []RealtimeFrame {
	h.mu.RLock()
	defer h.mu.RUnlock()

	frames, exists := h.eventHistory[dashboardID]
	if !exists {
		return []RealtimeFrame{}
	}
	copied := make([]RealtimeFrame, len(frames))
	copy(copied, frames)
	return copied
}
