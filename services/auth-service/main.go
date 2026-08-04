package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/dashboard-capsule-ai/services/auth-service/handlers"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8081"
	}

	authHandler := handlers.NewAuthHandler()
	adminHandler := handlers.NewAdminHandler()

	mux := http.NewServeMux()

	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status":"UP","service":"auth-service","version":"1.0.0"}`))
	})

	// Auth Handlers
	mux.HandleFunc("/api/v1/auth/register", authHandler.Register)
	mux.HandleFunc("/api/v1/auth/login", authHandler.Login)
	mux.HandleFunc("/api/v1/auth/refresh", authHandler.RefreshToken)
	mux.HandleFunc("/api/v1/auth/me", authHandler.Me)

	// Admin Portal Handlers
	mux.HandleFunc("/api/v1/admin/dashboard", adminHandler.GetAdminDashboard)
	mux.HandleFunc("/api/v1/admin/features", adminHandler.ListFeatureFlags)
	mux.HandleFunc("/api/v1/admin/backup", adminHandler.TriggerBackup)

	fmt.Printf("🔐 Dashboard Capsule AI — Identity & Enterprise Admin Portal running on port %s...\n", port)
	if err := http.ListenAndServe(":"+port, mux); err != nil {
		log.Fatalf("Fatal auth service error: %v", err)
	}
}
