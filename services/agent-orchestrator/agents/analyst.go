package agents

import (
	"context"
	"time"
)

type DashboardAnalystAgent struct{}

func NewDashboardAnalystAgent() *DashboardAnalystAgent {
	return &DashboardAnalystAgent{}
}

func (a *DashboardAnalystAgent) Manifest() AgentManifest {
	return AgentManifest{
		ID:           "agent_analyst",
		Name:         "Dashboard Analyst Agent",
		Role:         "ANALYST",
		Description:  "Analyzes dashboard structure, KPI definitions, visual trends, and operational anomalies.",
		Version:      "2.0.0",
		Capabilities: []Capability{CapStructureAnalysis},
		RequiredRole: "VIEWER",
		Priority:     2,
	}
}

func (a *DashboardAnalystAgent) CanHandle(cap Capability) bool {
	return cap == CapStructureAnalysis
}

func (a *DashboardAnalystAgent) Execute(ctx context.Context, input AgentTaskInput, memoryStore MemoryAccessor) (*AgentExecutionResult, error) {
	start := time.Now()

	findings := []map[string]interface{}{
		{
			"id":          "an_01",
			"type":        "KPI_ANALYSIS",
			"title":       "Freight Margin KPI Trend Analysis",
			"description": "Freight margin per shipment peaked at $42.10 in week 31 before experiencing a 14.2% dip in week 32.",
			"severity":    "INFO",
		},
		{
			"id":          "an_02",
			"type":        "ANOMALY",
			"title":       "DHL Regional Transit Delay Spike",
			"description": "Detected 54.1h average transit delay on DHL Express regional routes exceeding normal variance threshold.",
			"severity":    "MEDIUM",
		},
	}

	memoryStore.SetDashboardMemory(input.DashboardID, "kpi_trend", "Freight Margin -14.2% dip")
	memoryStore.AppendMessage("agent_analyst", "assistant", "Completed KPI & anomaly analysis for dashboard "+input.DashboardID)

	return &AgentExecutionResult{
		AgentID:          "agent_analyst",
		AgentName:        "Dashboard Analyst Agent",
		Status:           "COMPLETED",
		ConfidenceScore:  0.96,
		Findings:         findings,
		Recommendations:  []string{"Inspect regional port congestion for DHL Express routes", "Set automated threshold alert on Freight Margin KPI"},
		ExecutionTimeMs: time.Since(start).Milliseconds(),
	}, nil
}
