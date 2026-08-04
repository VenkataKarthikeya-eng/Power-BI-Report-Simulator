package handlers

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/dashboard-capsule-ai/services/digital-twin/engine"
	"github.com/dashboard-capsule-ai/services/digital-twin/nlu"
)

type DigitalTwinHandler struct {
	forecastEngine   *engine.ForecastEngine
	monteCarloEngine *engine.MonteCarloEngine
	whatIfEngine     *engine.WhatIfEngine
	nlEngine         *nlu.NaturalLanguageSimulationEngine
}

func NewDigitalTwinHandler(
	f *engine.ForecastEngine,
	m *engine.MonteCarloEngine,
	w *engine.WhatIfEngine,
	n *nlu.NaturalLanguageSimulationEngine,
) *DigitalTwinHandler {
	return &DigitalTwinHandler{
		forecastEngine:   f,
		monteCarloEngine: m,
		whatIfEngine:     w,
		nlEngine:         n,
	}
}

func (h *DigitalTwinHandler) CreateDigitalTwin(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req struct {
		DashboardID string `json:"dashboardId"`
		ModelName   string `json:"modelName"`
		Domain      string `json:"domain"`
	}
	json.NewDecoder(r.Body).Decode(&req)
	if req.DashboardID == "" {
		req.DashboardID = "dash_3c91a02b"
	}
	if req.ModelName == "" {
		req.ModelName = "Q3 Supply Chain Digital Twin"
	}

	twinID := "dtwin_" + fmtSprintf("%x", time.Now().UnixNano())[:10]

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"data": map[string]interface{}{
			"digitalTwinId": twinID,
			"dashboardId":   req.DashboardID,
			"modelName":     req.ModelName,
			"domain":        req.Domain,
			"activeVersion": "ver_101_base",
			"status":        "SYNCED",
			"createdAt":     time.Now().Format(time.RFC3339),
		},
	})
}

func (h *DigitalTwinHandler) Simulate(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req struct {
		Query      string             `json:"query,omitempty"`
		Parameters map[string]float64 `json:"parameters,omitempty"`
		RunType    string             `json:"runType,omitempty"` // WHAT_IF, MONTE_CARLO
	}
	json.NewDecoder(r.Body).Decode(&req)

	if req.Query != "" {
		ver, report, err := h.nlEngine.ProcessSimulationQuery(req.Query)
		if err != nil {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]interface{}{
				"success": false,
				"error":   map[string]string{"message": err.Error()},
			})
			return
		}
		mcResult := h.monteCarloEngine.RunSimulation(ver.SimulatedMetrics["revenueMargin"], 0.12, 1000)

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]interface{}{
			"success": true,
			"data": map[string]interface{}{
				"scenarioVersion": ver,
				"monteCarlo":     mcResult,
				"analysisReport": report,
			},
		})
		return
	}

	if req.RunType == "MONTE_CARLO" {
		mcResult := h.monteCarloEngine.RunSimulation(1482910.0, 0.15, 1000)
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]interface{}{
			"success": true,
			"data":    mcResult,
		})
		return
	}

	// Default What-If simulation
	if req.Parameters == nil {
		req.Parameters = map[string]float64{"salesGrowthPct": 15.0}
	}
	ver := h.whatIfEngine.ApplyWhatIf("Custom What-If Run", req.Parameters)
	mcResult := h.monteCarloEngine.RunSimulation(ver.SimulatedMetrics["revenueMargin"], 0.12, 1000)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"data": map[string]interface{}{
			"scenarioVersion": ver,
			"monteCarlo":     mcResult,
		},
	})
}

func (h *DigitalTwinHandler) Forecast(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req struct {
		MetricName   string  `json:"metricName"`
		Domain       string  `json:"domain"`
		BaseValue    float64 `json:"baseValue"`
		GrowthFactor float64 `json:"growthFactor"`
	}
	json.NewDecoder(r.Body).Decode(&req)
	if req.MetricName == "" {
		req.MetricName = "Freight Revenue Margin"
	}
	if req.BaseValue == 0 {
		req.BaseValue = 1482910.0
	}
	if req.GrowthFactor == 0 {
		req.GrowthFactor = 1.15
	}

	result := h.forecastEngine.GenerateForecast(req.MetricName, req.Domain, req.BaseValue, req.GrowthFactor)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"data":    result,
	})
}

func (h *DigitalTwinHandler) CompareScenarios(w http.ResponseWriter, r *http.Request) {
	comp := h.whatIfEngine.CompareScenarios()

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"data":    comp,
	})
}

func (h *DigitalTwinHandler) Rollback(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req struct {
		VersionID string `json:"versionId"`
	}
	json.NewDecoder(r.Body).Decode(&req)
	if req.VersionID == "" {
		req.VersionID = "ver_101_base"
	}

	ver, err := h.whatIfEngine.RollbackToVersion(req.VersionID)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(map[string]interface{}{
			"success": false,
			"error":   map[string]string{"message": err.Error()},
		})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"data": map[string]interface{}{
			"message":          "Digital twin state successfully rolled back to " + req.VersionID,
			"rolledBackVersion": ver,
		},
	})
}

func (h *DigitalTwinHandler) GetHistory(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"data": []map[string]interface{}{
			{
				"simulationId": "sim_run_9001",
				"runType":      "WHAT_IF",
				"name":         "Sales Growth (+20%) Simulation",
				"executedAt":   time.Now().Add(-2 * time.Hour).Format(time.RFC3339),
			},
			{
				"simulationId": "sim_run_9002",
				"runType":      "MONTE_CARLO",
				"name":         "1,000 Stochastic Iterations",
				"executedAt":   time.Now().Add(-1 * time.Hour).Format(time.RFC3339),
			},
		},
	})
}

func (h *DigitalTwinHandler) GetModels(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"data": []map[string]interface{}{
			{
				"digitalTwinId": "dtwin_supply_q3",
				"modelName":     "Global Supply Chain Digital Twin",
				"domain":        "SUPPLY_CHAIN",
				"activeVersion": "ver_101_base",
				"status":        "ACTIVE",
			},
		},
	})
}

func (h *DigitalTwinHandler) GetRecommendations(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"data": []map[string]interface{}{
			{
				"id":              "rec_twin_01",
				"title":           "Execute Freight Carrier SLA Re-negotiation",
				"impact":          "+$296,582 Revenue Margin",
				"confidenceScore": 0.98,
				"description":     "Optimistic +20% sales scenario yields highest P50 outcome ($1.78M) with acceptable SLA delay risk.",
			},
			{
				"id":              "rec_twin_02",
				"title":           "Hedge Fuel Surcharge Buffer",
				"impact":          "-65% Risk Variance",
				"confidenceScore": 0.95,
				"description":     "Monte Carlo P10 quantile indicates 18% exposure to regional carrier rate hikes.",
			},
		},
	})
}

func fmtSprintf(format string, a ...interface{}) string {
	return time.Now().Format("20060102150405")
}
