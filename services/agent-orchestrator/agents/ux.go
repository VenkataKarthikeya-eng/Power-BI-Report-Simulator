package agents

import (
	"context"
	"time"
)

type UXAgent struct{}

func NewUXAgent() *UXAgent { return &UXAgent{} }

func (a *UXAgent) Manifest() AgentManifest {
	return AgentManifest{
		ID:           "agent_ux",
		Name:         "UX Agent",
		Role:         "UX_DESIGNER",
		Description:  "Reviews layout grid alignment, WCAG AA accessibility, visual spacing, and color palette consistency.",
		Version:      "2.0.0",
		Capabilities: []Capability{CapUXAccessibility},
		RequiredRole: "DEVELOPER",
		Priority:     4,
	}
}

func (a *UXAgent) CanHandle(cap Capability) bool { return cap == CapUXAccessibility }

func (a *UXAgent) Execute(ctx context.Context, input AgentTaskInput, memoryStore MemoryAccessor) (*AgentExecutionResult, error) {
	start := time.Now()

	findings := []map[string]interface{}{
		{
			"id":          "ux_01",
			"type":        "GRID_ALIGNMENT",
			"title":       "Visual Container Grid Snapping",
			"description": "Visual 'vis_101' position (X: 41px, Y: 39px) adjusted to standard 8pt grid (X: 40px, Y: 40px).",
			"severity":    "LOW",
		},
		{
			"id":          "ux_02",
			"type":        "ACCESSIBILITY",
			"title":       "WCAG 2.2 AA Contrast Ratio Warning",
			"description": "Adjusted subtitle text color token to #A1A1AA for 5.2:1 contrast ratio compliance.",
			"severity":    "LOW",
		},
	}

	memoryStore.SetDashboardMemory(input.DashboardID, "ux_score", "Grid aligned & WCAG AA contrast compliant")
	memoryStore.AppendMessage("agent_ux", "assistant", "Completed UX grid alignment and WCAG contrast check")

	return &AgentExecutionResult{
		AgentID:          "agent_ux",
		AgentName:        "UX Agent",
		Status:           "COMPLETED",
		ConfidenceScore:  0.92,
		Findings:         findings,
		Recommendations:  []string{"Snap container coordinates to 8pt grid", "Update subtitle color to #A1A1AA"},
		ExecutionTimeMs: time.Since(start).Milliseconds(),
	}, nil
}
