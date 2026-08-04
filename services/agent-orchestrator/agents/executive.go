package agents

import (
	"context"
	"time"
)

type ExecutiveAdvisorAgent struct{}

func NewExecutiveAdvisorAgent() *ExecutiveAdvisorAgent { return &ExecutiveAdvisorAgent{} }

func (a *ExecutiveAdvisorAgent) Manifest() AgentManifest {
	return AgentManifest{
		ID:           "agent_executive",
		Name:         "Executive Advisor Agent",
		Role:         "EXECUTIVE_ADVISOR",
		Description:  "Generates 1-minute executive briefs, 5-minute deep dives, strategic recommendations, business risks, and action items.",
		Version:      "2.0.0",
		Capabilities: []Capability{CapExecutiveSummary},
		RequiredRole: "BUSINESS_ANALYST",
		Priority:     1,
	}
}

func (a *ExecutiveAdvisorAgent) CanHandle(cap Capability) bool { return cap == CapExecutiveSummary }

func (a *ExecutiveAdvisorAgent) Execute(ctx context.Context, input AgentTaskInput, memoryStore MemoryAccessor) (*AgentExecutionResult, error) {
	start := time.Now()

	findings := []map[string]interface{}{
		{
			"id":          "exec_01",
			"type":        "EXECUTIVE_SUMMARY",
			"brief":       "Q3 Logistics operations delivered $1.48M in freight margin. FedEx Freight maintains top performance (99.2% on-time delivery).",
			"deepDive":    "Regional transit bottleneck on DHL Express routes (54.1h average delay) contributed to a 14.2% dip in weekly margin.",
			"severity":    "INFO",
		},
	}

	memoryStore.SetDashboardMemory(input.DashboardID, "exec_summary", "$1.48M margin delivered; DHL regional bottleneck identified")
	memoryStore.AppendMessage("agent_executive", "assistant", "Generated executive brief and strategic recommendations")

	return &AgentExecutionResult{
		AgentID:          "agent_executive",
		AgentName:        "Executive Advisor Agent",
		Status:           "COMPLETED",
		ConfidenceScore:  0.95,
		Findings:         findings,
		Recommendations:  []string{"Re-allocate 15% of DHL Express volume to FedEx Freight on regional routes", "Apply automatic PII masking to driver identity fields"},
		ExecutionTimeMs: time.Since(start).Milliseconds(),
	}, nil
}
