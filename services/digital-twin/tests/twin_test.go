package tests

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/dashboard-capsule-ai/services/digital-twin/engine"
	"github.com/dashboard-capsule-ai/services/digital-twin/handlers"
	"github.com/dashboard-capsule-ai/services/digital-twin/nlu"
)

func TestDigitalTwinPipeline(t *testing.T) {
	fEngine := engine.NewForecastEngine()
	mcEngine := engine.NewMonteCarloEngine()
	wEngine := engine.NewWhatIfEngine()
	nlEngine := nlu.NewNaturalLanguageSimulationEngine(wEngine)

	// Test 1: 12-Month Predictive Forecast Engine
	forecast := fEngine.GenerateForecast("Freight Revenue", "SUPPLY_CHAIN", 1482910.0, 1.15)
	if len(forecast.Timeline) != 12 {
		t.Fatalf("Expected 12 forecast timeline points, got %d", len(forecast.Timeline))
	}
	t.Log("✅ Step 1: 12-Month Forecast Generation PASSED")

	// Test 2: Monte Carlo 1,000 Iteration Simulation
	mcResult := mcEngine.RunSimulation(1482910.0, 0.15, 1000)
	if mcResult.Iterations != 1000 || mcResult.Quantiles.P50 == 0 {
		t.Fatalf("Monte Carlo simulation failed: %+v", mcResult)
	}
	t.Logf("✅ Step 2: Monte Carlo 1,000 Iterations PASSED (P10: $%.2f, P50: $%.2f, P90: $%.2f)", mcResult.Quantiles.P10, mcResult.Quantiles.P50, mcResult.Quantiles.P90)

	// Test 3: Natural Language Simulation Query
	ver, report, err := nlEngine.ProcessSimulationQuery("What happens if sales increase by 20%?")
	if err != nil || ver.SimulatedMetrics["revenueMargin"] <= 1482910.0 {
		t.Fatalf("NL Simulation failed: %v", err)
	}
	t.Logf("✅ Step 3: Natural Language Simulation PASSED: %s", report)

	// Test 4: Scenario Rollback
	rolled, err := wEngine.RollbackToVersion("ver_101_base")
	if err != nil || rolled.VersionID != "ver_101_base" {
		t.Fatalf("Scenario Rollback failed: %v", err)
	}
	t.Log("✅ Step 4: Scenario Version Rollback PASSED")

	// Test 5: REST API Handler Test
	handler := handlers.NewDigitalTwinHandler(fEngine, mcEngine, wEngine, nlEngine)
	simBody := []byte(`{"query":"What if transportation cost increases by 12%?"}`)
	reqSim := httptest.NewRequest("POST", "/api/v2/digital-twin/simulate", bytes.NewReader(simBody))
	wSim := httptest.NewRecorder()
	handler.Simulate(wSim, reqSim)

	if wSim.Result().StatusCode != http.StatusOK {
		t.Fatalf("Simulate API returned status %d", wSim.Result().StatusCode)
	}
	var simResp map[string]interface{}
	json.NewDecoder(wSim.Body).Decode(&simResp)
	if simResp["success"] != true {
		t.Fatalf("Simulate API response success indicated false")
	}
	t.Log("✅ Step 5: API v2 Digital Twin Endpoint PASSED")
}
