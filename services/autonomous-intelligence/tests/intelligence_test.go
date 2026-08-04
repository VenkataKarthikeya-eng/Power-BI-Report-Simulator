package tests

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/dashboard-capsule-ai/services/autonomous-intelligence/handlers"
	"github.com/dashboard-capsule-ai/services/autonomous-intelligence/monitor"
	"github.com/dashboard-capsule-ai/services/autonomous-intelligence/workflow"
)

func TestAutonomousIntelligencePipeline(t *testing.T) {
	autoMonitor := monitor.NewAutonomousMonitor()
	workEngine := workflow.NewWorkflowEngine()

	// Test 1: Monitoring Rule & Alert Scanning
	alerts := autoMonitor.ScanDashboard("dash_test_auto")
	if len(alerts) == 0 {
		t.Fatalf("Expected autonomous alerts, got 0")
	}
	t.Log("✅ Step 1: Autonomous Monitoring & Anomaly Scan PASSED")

	// Test 2: Action Plan Approval Workflow
	exec, err := workEngine.ApproveActionPlan("plan_901_remediation", "Alex Rivera (ORG_ADMIN)")
	if err != nil || exec.Status != "SUCCESS" {
		t.Fatalf("Action plan approval failed: %v", err)
	}
	t.Log("✅ Step 2: Action Plan Approval & Execution PASSED")

	// Test 3: REST API Endpoints
	handler := handlers.NewIntelligenceHandler(autoMonitor, workEngine)

	reqAlerts := httptest.NewRequest("GET", "/api/v2/intelligence/alerts?dashboardId=dash_3c91a02b", nil)
	wAlerts := httptest.NewRecorder()
	handler.GetAlerts(wAlerts, reqAlerts)

	if wAlerts.Result().StatusCode != http.StatusOK {
		t.Fatalf("GetAlerts returned status %d", wAlerts.Result().StatusCode)
	}

	appBody := []byte(`{"planId":"plan_901_remediation","adminUser":"Alex Rivera"}`)
	reqApprove := httptest.NewRequest("POST", "/api/v2/intelligence/approve", bytes.NewReader(appBody))
	wApprove := httptest.NewRecorder()
	handler.ApprovePlan(wApprove, reqApprove)

	if wApprove.Result().StatusCode != http.StatusOK {
		t.Fatalf("ApprovePlan API returned status %d", wApprove.Result().StatusCode)
	}
	var appResp map[string]interface{}
	json.NewDecoder(wApprove.Body).Decode(&appResp)
	if appResp["success"] != true {
		t.Fatalf("ApprovePlan response indicated false")
	}
	t.Log("✅ Step 3: API v2 Autonomous Intelligence Endpoints PASSED")
}
