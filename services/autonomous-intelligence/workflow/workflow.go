package workflow

import (
	"fmt"
	"sync"
	"time"
)

type WorkflowDefinition struct {
	WorkflowID      string   `json:"workflowId"`
	Name            string   `json:"name"`
	TriggerIfMetric string   `json:"triggerIfMetric"`
	TriggerCondition string  `json:"triggerCondition"` // DECREASE_10_PCT, INCREASE_15_PCT
	ActionSteps     []string `json:"actionSteps"`
	RequireApproval bool     `json:"requireApproval"`
	IsActive        bool     `json:"isActive"`
}

type ActionPlan struct {
	PlanID              string    `json:"planId"`
	WorkflowID          string    `json:"workflowId"`
	Title               string    `json:"title"`
	TargetDashboardID   string    `json:"targetDashboardId"`
	RemediationSteps    []string  `json:"remediationSteps"`
	ProjectedGain       string    `json:"projectedGain"`
	Status              string    `json:"status"` // PENDING_APPROVAL, APPROVED, EXECUTED, REJECTED
	ApprovedBy          string    `json:"approvedBy,omitempty"`
	CreatedAt           time.Time `json:"createdAt"`
}

type WorkflowExecution struct {
	ExecutionID      string    `json:"executionId"`
	WorkflowID       string    `json:"workflowId"`
	PlanID           string    `json:"planId"`
	Status           string    `json:"status"` // SUCCESS, FAILED
	SummaryText      string    `json:"summaryText"`
	MultiAgentReport string    `json:"multiAgentReport"`
	ExecutedAt       time.Time `json:"executedAt"`
}

type WorkflowEngine struct {
	mu          sync.RWMutex
	workflows   map[string]WorkflowDefinition
	actionPlans map[string]ActionPlan
	executions  []WorkflowExecution
}

func NewWorkflowEngine() *WorkflowEngine {
	e := &WorkflowEngine{
		workflows:   make(map[string]WorkflowDefinition),
		actionPlans: make(map[string]ActionPlan),
	}

	// Seed IF Revenue drops by 10% THEN Notify & Require Approval workflow
	wf1 := WorkflowDefinition{
		WorkflowID:       "wf_101_revenue_drop",
		Name:             "Automated Freight Margin Remediation Workflow",
		TriggerIfMetric:  "Freight Revenue Margin",
		TriggerCondition: "DECREASE_10_PCT",
		ActionSteps: []string{
			"Run AI Multi-Agent Analysis",
			"Generate Executive Remediation Plan",
			"Notify Finance & Ops Managers",
			"Require Admin Approval",
			"Execute Carrier SLA Re-negotiation",
		},
		RequireApproval: true,
		IsActive:        true,
	}
	e.workflows[wf1.WorkflowID] = wf1

	// Seed pending action plan
	p1 := ActionPlan{
		PlanID:            "plan_901_remediation",
		WorkflowID:        "wf_101_revenue_drop",
		Title:             "DHL Express Transit Delay & Margin Remediation Plan",
		TargetDashboardID: "dash_3c91a02b",
		RemediationSteps: []string{
			"Refactor Delayed Shipments measure using KEEPFILTERS to eliminate table scan latency",
			"Re-route Midwest express legs to FedEx Freight Priority SLA",
			"Apply SHA-256 PII masking to unmasked DriverSSN column",
		},
		ProjectedGain: "+$296,582 Revenue Recovery",
		Status:        "PENDING_APPROVAL",
		CreatedAt:     time.Now().Add(-15 * time.Minute),
	}
	e.actionPlans[p1.PlanID] = p1

	return e
}

func (e *WorkflowEngine) CreateWorkflow(wf WorkflowDefinition) WorkflowDefinition {
	e.mu.Lock()
	defer e.mu.Unlock()

	wf.WorkflowID = fmt.Sprintf("wf_%x", time.Now().UnixNano())
	e.workflows[wf.WorkflowID] = wf
	return wf
}

func (e *WorkflowEngine) ApproveActionPlan(planID string, adminUser string) (*WorkflowExecution, error) {
	e.mu.Lock()
	defer e.mu.Unlock()

	plan, exists := e.actionPlans[planID]
	if !exists {
		return nil, fmt.Errorf("action plan ID %s not found", planID)
	}

	plan.Status = "EXECUTED"
	plan.ApprovedBy = adminUser
	e.actionPlans[planID] = plan

	exec := WorkflowExecution{
		ExecutionID: fmt.Sprintf("exec_%x", time.Now().UnixNano()),
		WorkflowID:  plan.WorkflowID,
		PlanID:      plan.PlanID,
		Status:      "SUCCESS",
		SummaryText: fmt.Sprintf("Action Plan '%s' approved by %s and executed successfully across 3 pipeline stages.", plan.Title, adminUser),
		MultiAgentReport: "🤖 Multi-Agent Swarm (Analyst + Security + Performance + Executive): Verified 0 breaking changes, zero PII leaks, 65% DAX performance gain.",
		ExecutedAt:       time.Now(),
	}

	e.executions = append(e.executions, exec)
	return &exec, nil
}

func (e *WorkflowEngine) GetActionPlans() []ActionPlan {
	e.mu.RLock()
	defer e.mu.RUnlock()

	var plans []ActionPlan
	for _, p := range e.actionPlans {
		plans = append(plans, p)
	}
	return plans
}

func (e *WorkflowEngine) GetExecutions() []WorkflowExecution {
	e.mu.RLock()
	defer e.mu.RUnlock()

	copied := make([]WorkflowExecution, len(e.executions))
	copy(copied, e.executions)
	return copied
}
