package handlers

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/dashboard-capsule-ai/services/realtime-service/engine"
	"github.com/dashboard-capsule-ai/services/realtime-service/hub"
)

type RealtimeHandler struct {
	hub    *hub.ConnectionHub
	engine *engine.RealtimeEngine
}

func NewRealtimeHandler(h *hub.ConnectionHub, e *engine.RealtimeEngine) *RealtimeHandler {
	return &RealtimeHandler{
		hub:    h,
		engine: e,
	}
}

func (h *RealtimeHandler) CreateSession(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req struct {
		DashboardID string `json:"dashboardId"`
		UserID      string `json:"userId"`
		UserName    string `json:"userName"`
	}
	json.NewDecoder(r.Body).Decode(&req)
	if req.DashboardID == "" {
		req.DashboardID = "dash_3c91a02b"
	}

	sessionID := "sess_live_9012"
	wsUrl := "ws://localhost:8087/ws?session=" + sessionID

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"data": map[string]interface{}{
			"sessionId":       sessionID,
			"dashboardId":     req.DashboardID,
			"webSocketUrl":    wsUrl,
			"isPresenter":     true,
			"heartbeatSec":    15,
			"activeUsers":     h.hub.GetPresence(req.DashboardID),
			"createdAt":       time.Now().Format(time.RFC3339),
		},
	})
}

func (h *RealtimeHandler) GetStatus(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"data": map[string]interface{}{
			"status":            "HEALTHY",
			"activeRooms":       1,
			"totalWebSockets":   4,
			"messageRatePerSec": 12.4,
			"replayStreamReady": true,
		},
	})
}

func (h *RealtimeHandler) CreateComment(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var comm engine.CommentRecord
	json.NewDecoder(r.Body).Decode(&comm)
	if comm.DashboardID == "" {
		comm.DashboardID = "dash_3c91a02b"
	}
	if comm.UserID == "" {
		comm.UserID = "usr_demo_10921"
		comm.UserName = "Alex Rivera"
	}

	created := h.engine.AddComment(comm)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"data":    created,
	})
}

func (h *RealtimeHandler) GetComments(w http.ResponseWriter, r *http.Request) {
	dashID := r.URL.Query().Get("dashboardId")
	if dashID == "" {
		dashID = "dash_3c91a02b"
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"data":    h.engine.GetComments(dashID),
	})
}

func (h *RealtimeHandler) CreateNotification(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var notif engine.NotificationRecord
	json.NewDecoder(r.Body).Decode(&notif)

	created := h.engine.AddNotification(notif)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"data":    created,
	})
}

func (h *RealtimeHandler) GetPresence(w http.ResponseWriter, r *http.Request) {
	dashID := r.URL.Query().Get("dashboardId")
	if dashID == "" {
		dashID = "dash_3c91a02b"
	}

	users := h.hub.GetPresence(dashID)
	if len(users) == 0 {
		// Provide active presence mock list if no WS clients connected yet
		users = []hub.PresenceUser{
			{
				UserID:    "usr_demo_10921",
				UserName:  "Alex Rivera",
				AvatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
				Role:      "ORG_ADMIN",
				PageID:    "Section_Q3_Overview",
				CursorX:   140.5,
				CursorY:   92.0,
				Status:    "PRESENTING",
				JoinedAt:  time.Now().Add(-20 * time.Minute),
			},
			{
				UserID:    "usr_demo_10922",
				UserName:  "Priya Sharma",
				AvatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
				Role:      "BUSINESS_ANALYST",
				PageID:    "Section_Q3_Overview",
				CursorX:   420.0,
				CursorY:   310.0,
				Status:    "ONLINE",
				JoinedAt:  time.Now().Add(-10 * time.Minute),
			},
		}
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"data":    users,
	})
}

func (h *RealtimeHandler) GetReplayTimeline(w http.ResponseWriter, r *http.Request) {
	dashID := r.URL.Query().Get("dashboardId")
	if dashID == "" {
		dashID = "dash_3c91a02b"
	}

	timeline := h.hub.GetReplayTimeline(dashID)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"data": map[string]interface{}{
			"dashboardId":   dashID,
			"totalFrames":   len(timeline),
			"timeline":      timeline,
			"durationSec":   120,
		},
	})
}
