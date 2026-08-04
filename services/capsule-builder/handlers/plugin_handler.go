package handlers

import (
	"encoding/json"
	"net/http"
	"time"
)

type PluginHandler struct{}

func NewPluginHandler() *PluginHandler {
	return &PluginHandler{}
}

func (h *PluginHandler) ListMarketplacePlugins(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"data": []map[string]interface{}{
			{
				"id":           "plugin_tableau_adapter",
				"name":         "Tableau Workbook (.twbx) Ingestion Adapter",
				"version":      "1.2.0",
				"category":     "BI_ADAPTER",
				"author":       "Dashboard Capsule AI Core Team",
				"description":  "Parses Tableau XML workbooks into standardized Dashboard AST.",
				"rating":       4.9,
				"installCount": 3420,
				"isInstalled":  true,
			},
			{
				"id":           "plugin_slack_notifications",
				"name":         "Slack Enterprise Alert Sync",
				"version":      "2.0.1",
				"category":     "INTEGRATION",
				"author":       "Slack Developer Ecosystem",
				"description":  "Sends real-time capsule compilation and health alerts to Slack channels.",
				"rating":       4.8,
				"installCount": 8900,
				"isInstalled":  true,
			},
			{
				"id":           "plugin_sankey_visual",
				"name":         "3D Sankey Flow Custom Visual",
				"version":      "1.0.4",
				"category":     "CUSTOM_VISUAL",
				"author":       "DataViz Studio Pro",
				"description":  "Renders interactive flow transitions on the WASM Viewer canvas.",
				"rating":       4.7,
				"installCount": 1840,
				"isInstalled":  false,
			},
		},
	})
}

func (h *PluginHandler) CreateWebhookSubscription(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"data": map[string]interface{}{
			"id":          "wh_sub_9012a8",
			"targetUrl":   "https://hooks.slack.com/services/T00/B00/XXXXX",
			"events":      []string{"capsule.built", "health.alert"},
			"secretToken": "whsec_8f9102ab30c92019a82019a82019",
			"isActive":    true,
			"createdAt":   time.Now().Format(time.RFC3339),
		},
	})
}
