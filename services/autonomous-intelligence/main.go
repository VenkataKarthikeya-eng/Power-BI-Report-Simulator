package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/dashboard-capsule-ai/services/autonomous-intelligence/handlers"
	"github.com/dashboard-capsule-ai/services/autonomous-intelligence/monitor"
	"github.com/dashboard-capsule-ai/services/autonomous-intelligence/workflow"
)

func main() {
	autoMonitor := monitor.NewAutonomousMonitor()
	workEngine := workflow.NewWorkflowEngine()

	handler := handlers.NewIntelligenceHandler(autoMonitor, workEngine)

	mux := http.NewServeMux()
	mux.HandleFunc("/api/v2/intelligence/rules", handler.CreateRule)
	mux.HandleFunc("/api/v2/intelligence/analyze", handler.Analyze)
	mux.HandleFunc("/api/v2/intelligence/workflows", handler.CreateWorkflow)
	mux.HandleFunc("/api/v2/intelligence/approve", handler.ApprovePlan)
	mux.HandleFunc("/api/v2/intelligence/alerts", handler.GetAlerts)
	mux.HandleFunc("/api/v2/intelligence/recommendations", handler.GetRecommendations)
	mux.HandleFunc("/api/v2/intelligence/action-plans", handler.GetActionPlans)
	mux.HandleFunc("/api/v2/intelligence/history", handler.GetHistory)

	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		fmt.Fprintln(w, `{"status":"UP","service":"autonomous-intelligence","version":"2.0.0"}`)
	})

	port := ":8090"
	log.Printf("🤖 Dashboard Capsule AI v2.0 Autonomous Intelligence Platform running on %s", port)
	if err := http.ListenAndServe(port, mux); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
