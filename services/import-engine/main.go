package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/dashboard-capsule-ai/services/import-engine/handlers"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8082"
	}

	importHandler := handlers.NewImportHandler()

	mux := http.NewServeMux()

	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status":"UP","service":"import-engine","version":"1.0.0"}`))
	})

	mux.HandleFunc("/api/v1/import/upload", importHandler.UploadPBIX)
	mux.HandleFunc("/api/v1/import/status", importHandler.GetStatus)
	mux.HandleFunc("/api/v1/import/history", importHandler.ListHistory)

	fmt.Printf("📦 Dashboard Capsule AI — Ingestion & VertiPaq AST Engine running on port %s...\n", port)
	if err := http.ListenAndServe(":"+port, mux); err != nil {
		log.Fatalf("Fatal import service error: %v", err)
	}
}
