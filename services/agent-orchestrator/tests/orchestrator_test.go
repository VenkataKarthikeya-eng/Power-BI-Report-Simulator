package tests

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/dashboard-capsule-ai/services/agent-orchestrator/agents"
	"github.com/dashboard-capsule-ai/services/agent-orchestrator/handlers"
	"github.com/dashboard-capsule-ai/services/agent-orchestrator/memory"
	"github.com/dashboard-capsule-ai/services/agent-orchestrator/orchestrator"
)

func TestMultiAgentSwarmOrchestration(t *testing.T) {
	registry := agents.NewAgentRegistry()
	memoryStore := memory.NewSharedMemoryStore()

	// Register 10 specialized agents
	registry.Register(agents.NewDashboardAnalystAgent())
	registry.Register(agents.NewDAXExpertAgent())
	registry.Register(agents.NewDataModelAgent())
	registry.Register(agents.NewUXAgent())
	registry.Register(agents.NewSecurityAgent())
	registry.Register(agents.NewPerformanceAgent())
	registry.Register(agents.NewExecutiveAdvisorAgent())
	registry.Register(agents.NewDocumentationAgent())
	registry.Register(agents.NewTestingAgent())
	registry.Register(agents.NewCoordinatorAgent())

	if len(registry.List()) != 10 {
		t.Fatalf("Expected 10 registered agents, got %d", len(registry.List()))
	}

	orch := orchestrator.NewAgentOrchestrator(registry, memoryStore)

	taskInput := agents.AgentTaskInput{
		TaskID:      "task_test_999",
		DashboardID: "dash_test_pbix",
		UserRole:    "ORG_ADMIN",
	}

	report, err := orch.RunSwarm(context.Background(), taskInput)
	if err != nil {
		t.Fatalf("Swarm execution failed: %v", err)
	}

	if report.Status != "COMPLETED" {
		t.Fatalf("Expected report status COMPLETED, got %s", report.Status)
	}

	if report.TotalAgentsRun < 10 {
		t.Fatalf("Expected at least 10 agent results, got %d", report.TotalAgentsRun)
	}

	if report.ConsensusScore < 0.90 {
		t.Fatalf("Expected consensus score >= 0.90, got %f", report.ConsensusScore)
	}

	t.Logf("✅ Parallel Swarm Execution PASSED: %d agents run, consensus %.2f", report.TotalAgentsRun, report.ConsensusScore)
}

func TestAgentAPIV2Handlers(t *testing.T) {
	registry := agents.GetGlobalRegistry()
	memoryStore := memory.NewSharedMemoryStore()

	registry.Register(agents.NewDashboardAnalystAgent())
	registry.Register(agents.NewDAXExpertAgent())
	registry.Register(agents.NewCoordinatorAgent())

	orch := orchestrator.NewAgentOrchestrator(registry, memoryStore)
	handler := handlers.NewAgentHandler(orch, registry, memoryStore)

	// Test POST /api/v2/agents/run
	runBody := []byte(`{"dashboardId":"dash_test_101","query":"Optimize DAX and layout"}`)
	reqRun := httptest.NewRequest("POST", "/api/v2/agents/run", bytes.NewReader(runBody))
	wRun := httptest.NewRecorder()
	handler.RunSwarm(wRun, reqRun)

	if wRun.Result().StatusCode != http.StatusOK {
		t.Fatalf("POST /api/v2/agents/run returned status %d", wRun.Result().StatusCode)
	}

	var runResp map[string]interface{}
	json.NewDecoder(wRun.Body).Decode(&runResp)
	if runResp["success"] != true {
		t.Fatalf("Run response success indicated false")
	}

	// Test GET /api/v2/agents/status
	reqStatus := httptest.NewRequest("GET", "/api/v2/agents/status", nil)
	wStatus := httptest.NewRecorder()
	handler.GetStatus(wStatus, reqStatus)

	if wStatus.Result().StatusCode != http.StatusOK {
		t.Fatalf("GET /api/v2/agents/status returned status %d", wStatus.Result().StatusCode)
	}

	// Test GET /api/v2/agents/metrics
	reqMetrics := httptest.NewRequest("GET", "/api/v2/agents/metrics", nil)
	wMetrics := httptest.NewRecorder()
	handler.GetMetrics(wMetrics, reqMetrics)

	if wMetrics.Result().StatusCode != http.StatusOK {
		t.Fatalf("GET /api/v2/agents/metrics returned status %d", wMetrics.Result().StatusCode)
	}

	t.Log("✅ API v2 Handlers Execution Test PASSED")
}
