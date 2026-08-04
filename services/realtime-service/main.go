package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/dashboard-capsule-ai/services/realtime-service/engine"
	"github.com/dashboard-capsule-ai/services/realtime-service/handlers"
	"github.com/dashboard-capsule-ai/services/realtime-service/hub"
)

func main() {
	connectionHub := hub.GetGlobalHub()
	realtimeEngine := engine.NewRealtimeEngine()
	handler := handlers.NewRealtimeHandler(connectionHub, realtimeEngine)

	mux := http.NewServeMux()
	mux.HandleFunc("/api/v2/realtime/session", handler.CreateSession)
	mux.HandleFunc("/api/v2/realtime/status", handler.GetStatus)
	mux.HandleFunc("/api/v2/comments", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodPost {
			handler.CreateComment(w, r)
		} else {
			handler.GetComments(w, r)
		}
	})
	mux.HandleFunc("/api/v2/notifications", handler.CreateNotification)
	mux.HandleFunc("/api/v2/presence", handler.GetPresence)
	mux.HandleFunc("/api/v2/realtime/replay", handler.GetReplayTimeline)

	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		fmt.Fprintln(w, `{"status":"UP","service":"realtime-service","version":"2.0.0"}`)
	})

	port := ":8087"
	log.Printf("📡 Dashboard Capsule AI v2.0 Real-Time Service running on %s", port)
	if err := http.ListenAndServe(port, mux); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
