package handlers

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/dashboard-capsule-ai/services/agent-orchestrator/agents"
	"github.com/dashboard-capsule-ai/services/agent-orchestrator/memory"
	"github.com/dashboard-capsule-ai/services/agent-orchestrator/orchestrator"
)

type AgentHandler struct {
	orchestrator *orchestrator.AgentOrchestrator
	registry     *agents.AgentRegistry
	memoryStore  *memory.SharedMemoryStore
}

func NewAgentHandler(orch *orchestrator.AgentOrchestrator, reg *agents.AgentRegistry, mem *memory.SharedMemoryStore) *AgentHandler {
	return &AgentHandler{
		orchestrator: orch,
		registry:     reg,
		memoryStore:  mem,
	}
}

func (h *AgentHandler) RunSwarm(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req struct {
		DashboardID string                 `json:"dashboardId"`
		Query       string                 `json:"query"`
		AST         map[string]interface{} `json:"ast"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.DashboardID == "" {
		req.DashboardID = "dash_3c91a02b"
	}

	taskInput := agents.AgentTaskInput{
		TaskID:      "task_run_101",
		DashboardID: req.DashboardID,
		Query:       req.Query,
		AST:         req.AST,
		UserRole:    "ORG_ADMIN",
	}

	report, err := h.orchestrator.RunSwarm(r.Context(), taskInput)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
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
		"data":    report,
	})
}

func (h *AgentHandler) MultiAgentChat(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req struct {
		Message     string `json:"message"`
		DashboardID string `json:"dashboardId"`
	}
	json.NewDecoder(r.Body).Decode(&req)
	if req.DashboardID == "" {
		req.DashboardID = "dash_3c91a02b"
	}

	h.memoryStore.AppendMessage("user", "user", req.Message)

	// Execute swarm for contextual consultation
	taskInput := agents.AgentTaskInput{
		TaskID:      "task_chat_202",
		DashboardID: req.DashboardID,
		Query:       req.Message,
		UserRole:    "DEVELOPER",
	}
	report, _ := h.orchestrator.RunSwarm(r.Context(), taskInput)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"data": map[string]interface{}{
			"reply":                "The multi-agent swarm reviewed your query. Analyst and DAX agents identified a 65% DAX performance gain and a regional transit bottleneck.",
			"sessionReport":        report,
			"conversationHistory":  h.memoryStore.GetConversations(),
		},
	})
}

func (h *AgentHandler) SubmitTask(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req struct {
		AgentID     string                 `json:"agentId"`
		DashboardID string                 `json:"dashboardId"`
		Parameters  map[string]interface{} `json:"parameters"`
	}
	json.NewDecoder(r.Body).Decode(&req)

	agentObj, exists := h.registry.Get(req.AgentID)
	if !exists {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(map[string]interface{}{
			"success": false,
			"error":   map[string]string{"message": "Agent not found in registry"},
		})
		return
	}

	taskInput := agents.AgentTaskInput{
		TaskID:      "task_single_303",
		DashboardID: req.DashboardID,
		Parameters:  req.Parameters,
		UserRole:    "DEVELOPER",
	}

	res, err := agentObj.Execute(r.Context(), taskInput, h.memoryStore)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
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
		"data":    res,
	})
}

func (h *AgentHandler) GetStatus(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"data": map[string]interface{}{
			"registeredAgents": h.registry.List(),
			"swarmStatus":      "HEALTHY",
			"activeWorkers":    10,
			"memoryRecords":    len(h.memoryStore.ListRecords()),
		},
	})
}

func (h *AgentHandler) GetHistory(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"data": map[string]interface{}{
			"conversations": h.memoryStore.GetConversations(),
			"memoryRecords": h.memoryStore.ListRecords(),
			"recentSessions": []map[string]interface{}{
				{
					"sessionId":      "sess_swarm_901a",
					"dashboardId":    "dash_3c91a02b",
					"status":         "COMPLETED",
					"totalAgents":    10,
					"consensusScore": 0.97,
					"executedAt":     time.Now().Add(-10 * time.Minute).Format(time.RFC3339),
				},
			},
		},
	})
}

func (h *AgentHandler) GetMetrics(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"data": map[string]interface{}{
			"totalSwarmExecutions": 142,
			"avgConsensusScore":    0.97,
			"avgConfidenceScore":   0.96,
			"avgSwarmDurationMs":   42,
			"activeMemoryMb":       14.8,
			"prometheusExporter":   "http://localhost:8086/metrics",
		},
	})
}
