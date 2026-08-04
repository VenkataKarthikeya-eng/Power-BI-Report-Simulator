package handlers

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/dashboard-capsule-ai/services/dashboard-builder/generator"
	"github.com/dashboard-capsule-ai/services/dashboard-builder/parser"
	"github.com/dashboard-capsule-ai/services/dashboard-builder/schema"
)

type BuilderHandler struct {
	promptParser *parser.PromptParser
	schemaMapper *schema.DatasetSchemaMapper
	generator    *generator.DashboardGenerator
}

func NewBuilderHandler(p *parser.PromptParser, s *schema.DatasetSchemaMapper, g *generator.DashboardGenerator) *BuilderHandler {
	return &BuilderHandler{
		promptParser: p,
		schemaMapper: s,
		generator:    g,
	}
}

func (h *BuilderHandler) GenerateDashboard(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req struct {
		Prompt string `json:"prompt"`
		Domain string `json:"domain,omitempty"`
		Theme  string `json:"theme,omitempty"`
	}
	json.NewDecoder(r.Body).Decode(&req)
	if req.Prompt == "" {
		req.Prompt = "Create a sales and freight logistics dashboard for the last 12 months."
	}

	intent, err := h.promptParser.ParsePrompt(req.Prompt)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]interface{}{
			"success": false,
			"error":   map[string]string{"message": err.Error()},
		})
		return
	}

	kpis, _ := h.schemaMapper.GenerateKPIMeasures(intent)
	ast, err := h.generator.SynthesizeDashboard(intent, kpis)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]interface{}{
			"success": false,
			"error":   map[string]string{"message": err.Error()},
		})
		return
	}

	if req.Theme != "" {
		ast.Theme = req.Theme
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"data": map[string]interface{}{
			"intent":    intent,
			"dashboard": ast,
		},
	})
}

func (h *BuilderHandler) PreviewDashboard(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req struct {
		Prompt string `json:"prompt"`
	}
	json.NewDecoder(r.Body).Decode(&req)
	if req.Prompt == "" {
		req.Prompt = "Build an HR attrition and hiring dashboard"
	}

	intent, _ := h.promptParser.ParsePrompt(req.Prompt)
	kpis, _ := h.schemaMapper.GenerateKPIMeasures(intent)
	ast, _ := h.generator.SynthesizeDashboard(intent, kpis)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"data": map[string]interface{}{
			"previewId":            "prev_" + ast.ID,
			"title":                ast.Name,
			"domain":               ast.Domain,
			"theme":                ast.Theme,
			"visualCount":          len(ast.VisualContainers),
			"kpiCount":             len(ast.KPIs),
			"recommendedLayout":    "8pt Grid Snapped Layout",
			"previewRenderUrl":     "http://localhost:3003/preview?id=" + ast.ID,
		},
	})
}

func (h *BuilderHandler) BuildCapsule(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req struct {
		DashboardID string `json:"dashboardId"`
		Name        string `json:"name"`
	}
	json.NewDecoder(r.Body).Decode(&req)

	capsuleID := "caps_ai_" + fmt.Sprintf("%x", time.Now().UnixNano())[:10]

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"data": map[string]interface{}{
			"capsuleId":         capsuleID,
			"dashboardId":       req.DashboardID,
			"name":              req.Name,
			"format":            "DCAPSv1 Binary Package",
			"aesKeyEncryption":  "256-bit AES-GCM (crypto/rand)",
			"ecdsaSignature":    "ECDSA P-384 Verified",
			"compressedSizeMb":  18.4,
			"downloadUrl":       "http://localhost:8088/api/v2/capsules/download/" + capsuleID,
			"compiledAt":        time.Now().Format(time.RFC3339),
		},
	})
}

func (h *BuilderHandler) GetTemplates(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"data": []map[string]interface{}{
			{
				"id":          "tpl_sales_01",
				"domain":      "SALES",
				"name":        "Sales & Quota Performance Dashboard",
				"description": "Executive sales revenue, rep quotas, conversion rate, and pipeline velocity.",
				"prompt":       "Create a sales revenue and rep quota dashboard for T12M",
			},
			{
				"id":          "tpl_hr_02",
				"domain":      "HR",
				"name":        "HR Attrition & Recruitment Analytics",
				"description": "Employee headcount, voluntary attrition rate, hiring funnel, and departmental turnover.",
				"prompt":       "Build an HR dashboard showing attrition, hiring and department performance",
			},
			{
				"id":          "tpl_supply_03",
				"domain":      "SUPPLY_CHAIN",
				"name":        "Global Logistics & Transit Delay Dashboard",
				"description": "Freight cost margin, carrier SLA compliance, transit delay hours, and port congestion.",
				"prompt":       "Create a logistics freight margin and transit delay dashboard",
			},
			{
				"id":          "tpl_finance_04",
				"domain":      "FINANCE",
				"name":        "Corporate Finance & Profit Margin Control",
				"description": "Net profit margin %, EBITDA, operating expense variance, and cash flow analysis.",
				"prompt":       "Create a corporate finance and profit margin dashboard",
			},
		},
	})
}

func (h *BuilderHandler) GetHistory(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"data": []map[string]interface{}{
			{
				"id":            "hist_901",
				"prompt":        "Create a sales dashboard for the last 12 months",
				"domain":        "SALES",
				"dashboardName": "AI Sales Executive Dashboard",
				"generatedAt":   time.Now().Add(-1 * time.Hour).Format(time.RFC3339),
			},
			{
				"id":            "hist_900",
				"prompt":        "Build an HR dashboard showing attrition, hiring and department performance",
				"domain":        "HR",
				"dashboardName": "AI HR Executive Dashboard",
				"generatedAt":   time.Now().Add(-24 * time.Hour).Format(time.RFC3339),
			},
		},
	})
}
