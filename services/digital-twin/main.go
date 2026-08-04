package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/dashboard-capsule-ai/services/digital-twin/engine"
	"github.com/dashboard-capsule-ai/services/digital-twin/handlers"
	"github.com/dashboard-capsule-ai/services/digital-twin/nlu"
)

func main() {
	forecastEngine := engine.NewForecastEngine()
	monteCarloEngine := engine.NewMonteCarloEngine()
	whatIfEngine := engine.NewWhatIfEngine()
	nlEngine := nlu.NewNaturalLanguageSimulationEngine(whatIfEngine)

	handler := handlers.NewDigitalTwinHandler(forecastEngine, monteCarloEngine, whatIfEngine, nlEngine)

	mux := http.NewServeMux()
	mux.HandleFunc("/api/v2/digital-twin/create", handler.CreateDigitalTwin)
	mux.HandleFunc("/api/v2/digital-twin/simulate", handler.Simulate)
	mux.HandleFunc("/api/v2/digital-twin/forecast", handler.Forecast)
	mux.HandleFunc("/api/v2/digital-twin/compare", handler.CompareScenarios)
	mux.HandleFunc("/api/v2/digital-twin/rollback", handler.Rollback)
	mux.HandleFunc("/api/v2/digital-twin/history", handler.GetHistory)
	mux.HandleFunc("/api/v2/digital-twin/models", handler.GetModels)
	mux.HandleFunc("/api/v2/digital-twin/recommendations", handler.GetRecommendations)

	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		fmt.Fprintln(w, `{"status":"UP","service":"digital-twin","version":"2.0.0"}`)
	})

	port := ":8089"
	log.Printf("🔮 Dashboard Capsule AI v2.0 Digital Twin Platform running on %s", port)
	if err := http.ListenAndServe(port, mux); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
