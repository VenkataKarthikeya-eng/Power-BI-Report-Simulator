package engine

import (
	"fmt"
	"sync"
	"time"

	"github.com/dashboard-capsule-ai/services/realtime-service/hub"
)

type CommentRecord struct {
	ID          string    `json:"id"`
	DashboardID string    `json:"dashboardId"`
	UserID      string    `json:"userId"`
	UserName    string    `json:"userName"`
	Content     string    `json:"content"`
	Mentions    []string  `json:"mentions,omitempty"`
	IsResolved  bool      `json:"isResolved"`
	CreatedAt   time.Time `json:"createdAt"`
}

type NotificationRecord struct {
	ID        string    `json:"id"`
	UserID    string    `json:"userId"`
	Title     string    `json:"title"`
	Message   string    `json:"message"`
	Category  string    `json:"category"` // comment, mention, share, ai_analysis, replay
	IsRead    bool      `json:"isRead"`
	CreatedAt time.Time `json:"createdAt"`
}

type RealtimeEngine struct {
	mu            sync.RWMutex
	comments      map[string][]CommentRecord
	notifications map[string][]NotificationRecord
}

func NewRealtimeEngine() *RealtimeEngine {
	engine := &RealtimeEngine{
		comments:      make(map[string][]CommentRecord),
		notifications: make(map[string][]NotificationRecord),
	}

	// Seed initial live collaboration state
	engine.comments["dash_3c91a02b"] = []CommentRecord{
		{
			ID:          "comm_101",
			DashboardID: "dash_3c91a02b",
			UserID:      "usr_demo_10921",
			UserName:    "Alex Rivera",
			Content:     "@PriyaSharma Check out the DHL Express transit delay in week 32.",
			Mentions:    []string{"priya.sharma@acme.com"},
			IsResolved:  false,
			CreatedAt:   time.Now().Add(-15 * time.Minute),
		},
	}

	return engine
}

func (e *RealtimeEngine) AddComment(comment CommentRecord) CommentRecord {
	e.mu.Lock()
	defer e.mu.Unlock()

	comment.ID = fmt.Sprintf("comm_%x", time.Now().UnixNano())
	comment.CreatedAt = time.Now()

	e.comments[comment.DashboardID] = append(e.comments[comment.DashboardID], comment)

	// Broadcast comment event frame to room
	frame := hub.RealtimeFrame{
		ID:          fmt.Sprintf("frame_%x", time.Now().UnixNano()),
		SessionID:   "sess_live_active",
		DashboardID: comment.DashboardID,
		UserID:      comment.UserID,
		UserName:    comment.UserName,
		EventType:   hub.EventCommentAdd,
		Payload: map[string]interface{}{
			"commentId":  comment.ID,
			"content":    comment.Content,
			"isResolved": comment.IsResolved,
		},
		Timestamp: time.Now(),
	}
	hub.GetGlobalHub().BroadcastFrame(frame)

	return comment
}

func (e *RealtimeEngine) GetComments(dashboardID string) []CommentRecord {
	e.mu.RLock()
	defer e.mu.RUnlock()

	comms, exists := e.comments[dashboardID]
	if !exists {
		return []CommentRecord{}
	}
	copied := make([]CommentRecord, len(comms))
	copy(copied, comms)
	return copied
}

func (e *RealtimeEngine) AddNotification(notif NotificationRecord) NotificationRecord {
	e.mu.Lock()
	defer e.mu.Unlock()

	notif.ID = fmt.Sprintf("notif_%x", time.Now().UnixNano())
	notif.CreatedAt = time.Now()

	e.notifications[notif.UserID] = append(e.notifications[notif.UserID], notif)
	return notif
}
