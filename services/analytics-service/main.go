package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/dashboard-capsule-ai/services/analytics-service/handlers"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8084"
	}

	analyticsHandler := handlers.NewAnalyticsHandler()

	mux := http.NewServeMux()

	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status":"UP","service":"analytics-service","version":"1.0.0"}`))
	})

	mux.HandleFunc("/api/v1/analytics/dashboard", analyticsHandler.GetDashboardAnalytics)
	mux.HandleFunc("/api/v1/analytics/performance", analyticsHandler.GetPerformanceAnalytics)
	mux.HandleFunc("/api/v1/analytics/ai", analyticsHandler.GetAIAnalytics)
	mux.HandleFunc("/api/v1/analytics/security", analyticsHandler.GetSecurityAnalytics)

	fmt.Printf("📊 Dashboard Capsule AI — Columnar Telemetry & Analytics Engine running on port %s...\n", port)
	if err := http.ListenAndServe(":"+port, mux); err != nil {
		log.Fatalf("Fatal analytics service error: %v", err)
	}
}
