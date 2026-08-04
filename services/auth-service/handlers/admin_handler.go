package handlers

import (
	"encoding/json"
	"net/http"
	"time"
)

type AdminHandler struct{}

func NewAdminHandler() *AdminHandler {
	return &AdminHandler{}
}

func (h *AdminHandler) GetAdminDashboard(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"data": map[string]interface{}{
			"clusterCpuUsagePercent": 18.4,
			"clusterMemoryUsageMb":   2048,
			"apiLatencyP99Ms":        24,
			"activeWasmSessions":     142,
			"activeTenantsCount":     12,
			"databaseConnections":    48,
		},
	})
}

func (h *AdminHandler) ListFeatureFlags(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"data": []map[string]interface{}{
			{
				"id":                   "ff_01",
				"key":                  "ai_copilot_v2",
				"name":                 "AI Copilot RAG V2 Engine",
				"isEnabled":            true,
				"targetRolloutPercent": 100,
			},
			{
				"id":                   "ff_02",
				"key":                  "wasm_simd_canvas",
				"name":                 "WebAssembly SIMD Visual Canvas",
				"isEnabled":            true,
				"targetRolloutPercent": 50,
			},
		},
	})
}

func (h *AdminHandler) TriggerBackup(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"data": map[string]interface{}{
			"id":         "snap_20260803_0452",
			"fileName":   "dcaps_prod_backup_20260803.sql.gz",
			"sizeBytes":  482910482,
			"sha256Hash": "8f9102ab30c92019a82019a82019a820",
			"status":     "COMPLETED",
			"createdAt":  time.Now().Format(time.RFC3339),
		},
	})
}
