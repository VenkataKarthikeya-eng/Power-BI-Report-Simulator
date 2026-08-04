package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/dashboard-capsule-ai/services/agent-orchestrator/agents"
	"github.com/dashboard-capsule-ai/services/agent-orchestrator/handlers"
	"github.com/dashboard-capsule-ai/services/agent-orchestrator/memory"
	"github.com/dashboard-capsule-ai/services/agent-orchestrator/orchestrator"
)

func main() {
	registry := agents.GetGlobalRegistry()
	memoryStore := memory.NewSharedMemoryStore()

	// Register all 10 specialized enterprise agents
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

	orch := orchestrator.NewAgentOrchestrator(registry, memoryStore)
	handler := handlers.NewAgentHandler(orch, registry, memoryStore)

	mux := http.NewServeMux()
	mux.HandleFunc("/api/v2/agents/run", handler.RunSwarm)
	mux.HandleFunc("/api/v2/agents/chat", handler.MultiAgentChat)
	mux.HandleFunc("/api/v2/agents/task", handler.SubmitTask)
	mux.HandleFunc("/api/v2/agents/status", handler.GetStatus)
	mux.HandleFunc("/api/v2/agents/history", handler.GetHistory)
	mux.HandleFunc("/api/v2/agents/metrics", handler.GetMetrics)

	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		fmt.Fprintln(w, `{"status":"UP","service":"agent-orchestrator","version":"2.0.0"}`)
	})

	port := ":8086"
	log.Printf("🤖 Dashboard Capsule AI v2.0 Agent Orchestrator running on %s", port)
	if err := http.ListenAndServe(port, mux); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
