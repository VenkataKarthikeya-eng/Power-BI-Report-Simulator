package agents

import (
	"context"
	"time"
)

type Capability string

const (
	CapStructureAnalysis Capability = "structure_analysis"
	CapDAXOptimization   Capability = "dax_optimization"
	CapSchemaReview      Capability = "schema_review"
	CapUXAccessibility   Capability = "ux_accessibility"
	CapSecurityAudit     Capability = "security_audit"
	CapPerformanceReview Capability = "performance_review"
	CapExecutiveSummary  Capability = "executive_summary"
	CapDocumentation     Capability = "documentation"
	CapTestingValidation Capability = "testing_validation"
	CapSwarmCoordination Capability = "swarm_coordination"
)

type AgentManifest struct {
	ID           string       `json:"id"`
	Name         string       `json:"name"`
	Role         string       `json:"role"`
	Description  string       `json:"description"`
	Version      string       `json:"version"`
	Capabilities []Capability `json:"capabilities"`
	RequiredRole string       `json:"requiredRole"`
	Priority     int          `json:"priority"` // 1 (Highest) to 10 (Lowest)
}

type AgentTaskInput struct {
	TaskID      string                 `json:"taskId"`
	DashboardID string                 `json:"dashboardId"`
	Query       string                 `json:"query,omitempty"`
	AST         map[string]interface{} `json:"ast,omitempty"`
	Parameters  map[string]interface{} `json:"parameters,omitempty"`
	UserRole    string                 `json:"userRole"`
}

type AgentExecutionResult struct {
	AgentID          string                 `json:"agentId"`
	AgentName        string                 `json:"agentName"`
	Status           string                 `json:"status"` // COMPLETED, FAILED, SKIPPED
	ConfidenceScore  float64                `json:"confidenceScore"`
	Findings         []map[string]interface{}`json:"findings"`
	Recommendations  []string               `json:"recommendations"`
	ExecutionTimeMs int64                  `json:"executionTimeMs"`
	Metadata         map[string]interface{} `json:"metadata,omitempty"`
	Error            string                 `json:"error,omitempty"`
}

type Agent interface {
	Manifest() AgentManifest
	CanHandle(cap Capability) bool
	Execute(ctx context.Context, input AgentTaskInput, memoryStore MemoryAccessor) (*AgentExecutionResult, error)
}

type MemoryAccessor interface {
	GetShortTerm(key string) (interface{}, bool)
	SetShortTerm(key string, val interface{})
	GetDashboardMemory(dashboardID, key string) (interface{}, bool)
	SetDashboardMemory(dashboardID, key string, val interface{})
	AppendMessage(agentID, role, content string)
}
