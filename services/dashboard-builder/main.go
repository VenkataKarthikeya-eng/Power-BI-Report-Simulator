package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/dashboard-capsule-ai/services/dashboard-builder/generator"
	"github.com/dashboard-capsule-ai/services/dashboard-builder/handlers"
	"github.com/dashboard-capsule-ai/services/dashboard-builder/parser"
	"github.com/dashboard-capsule-ai/services/dashboard-builder/schema"
)

func main() {
	promptParser := parser.NewPromptParser()
	schemaMapper := schema.NewDatasetSchemaMapper()
	dashGenerator := generator.NewDashboardGenerator()
	handler := handlers.NewBuilderHandler(promptParser, schemaMapper, dashGenerator)

	mux := http.NewServeMux()
	mux.HandleFunc("/api/v2/dashboard-builder/generate", handler.GenerateDashboard)
	mux.HandleFunc("/api/v2/dashboard-builder/preview", handler.PreviewDashboard)
	mux.HandleFunc("/api/v2/dashboard-builder/build", handler.BuildCapsule)
	mux.HandleFunc("/api/v2/dashboard-builder/templates", handler.GetTemplates)
	mux.HandleFunc("/api/v2/dashboard-builder/history", handler.GetHistory)

	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		fmt.Fprintln(w, `{"status":"UP","service":"dashboard-builder","version":"2.0.0"}`)
	})

	port := ":8088"
	log.Printf("🎨 Dashboard Capsule AI v2.0 AI Dashboard Builder running on %s", port)
	if err := http.ListenAndServe(port, mux); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
