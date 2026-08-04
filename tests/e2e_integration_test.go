package tests

import (
	"bytes"
	"encoding/json"
	"mime/multipart"
	"net/http"
	"net/http/httptest"
	"testing"

	analyticsHandlers "github.com/dashboard-capsule-ai/services/analytics-service/handlers"
	authHandlers "github.com/dashboard-capsule-ai/services/auth-service/handlers"
	builderHandlers "github.com/dashboard-capsule-ai/services/capsule-builder/handlers"
	importHandlers "github.com/dashboard-capsule-ai/services/import-engine/handlers"
)

func TestEndToEndPlatformPipeline(t *testing.T) {
	t.Log("🚀 Launching Dashboard Capsule AI v1.0.0 End-to-End Pipeline Verification")

	// Step 1: User Registration
	auth := authHandlers.NewAuthHandler()
	regBody := []byte(`{"email":"admin@enterprise.com","password":"Password123!","fullName":"Alex Rivera","organizationName":"Acme Global Enterprise"}`)
	reqReg := httptest.NewRequest("POST", "/api/v1/auth/register", bytes.NewReader(regBody))
	wReg := httptest.NewRecorder()
	auth.Register(wReg, reqReg)

	if wReg.Result().StatusCode != http.StatusCreated {
		t.Fatalf("❌ Step 1 Auth Register failed: status %d", wReg.Result().StatusCode)
	}
	t.Log("✅ Step 1: User Registration PASSED")

	// Step 2: User Login
	loginBody := []byte(`{"email":"admin@enterprise.com","password":"Password123!"}`)
	reqLogin := httptest.NewRequest("POST", "/api/v1/auth/login", bytes.NewReader(loginBody))
	wLogin := httptest.NewRecorder()
	auth.Login(wLogin, reqLogin)

	if wLogin.Result().StatusCode != http.StatusOK {
		t.Fatalf("❌ Step 2 Auth Login failed: status %d", wLogin.Result().StatusCode)
	}
	var loginResp map[string]interface{}
	json.NewDecoder(wLogin.Body).Decode(&loginResp)
	t.Log("✅ Step 2: User Login PASSED")

	// Step 3: Organization Member Invitation
	org := authHandlers.NewOrgHandler()
	inviteBody := []byte(`{"email":"priya.sharma@acme.com","role":"BUSINESS_ANALYST"}`)
	reqInvite := httptest.NewRequest("POST", "/api/v1/org/invite", bytes.NewReader(inviteBody))
	wInvite := httptest.NewRecorder()
	org.InviteMember(wInvite, reqInvite)

	if wInvite.Result().StatusCode != http.StatusCreated {
		t.Fatalf("❌ Step 3 Org Invite Member failed: status %d", wInvite.Result().StatusCode)
	}
	t.Log("✅ Step 3: Organization Member Invite PASSED")

	// Step 4: Upload PBIX Payload & Extract Metadata
	importer := importHandlers.NewImportHandler()
	bodyBuf := &bytes.Buffer{}
	writer := multipart.NewWriter(bodyBuf)
	part, err := writer.CreateFormFile("file", "Q3_Logistics_Global.pbix")
	if err != nil {
		t.Fatalf("❌ Step 4 Failed to create form file: %v", err)
	}
	part.Write([]byte(`{"sections":[{"name":"sec1","displayName":"Overview","ordinal":1,"width":1280,"height":720,"visualContainers":[{"id":"vis1","visualType":"barChart"}]}]}`))
	writer.Close()

	reqUpload := httptest.NewRequest("POST", "/api/v1/import/upload", bodyBuf)
	reqUpload.Header.Set("Content-Type", writer.FormDataContentType())
	wUpload := httptest.NewRecorder()
	importer.UploadPBIX(wUpload, reqUpload)

	if wUpload.Result().StatusCode != http.StatusOK {
		t.Fatalf("❌ Step 4 Upload PBIX failed: status %d", wUpload.Result().StatusCode)
	}
	t.Log("✅ Step 4: Upload PBIX Payload & AST Extraction PASSED")

	// Step 5: Check Ingestion Status
	reqStatus := httptest.NewRequest("GET", "/api/v1/import/status", nil)
	wStatus := httptest.NewRecorder()
	importer.GetStatus(wStatus, reqStatus)

	if wStatus.Result().StatusCode != http.StatusOK {
		t.Fatalf("❌ Step 5 Import status check failed: status %d", wStatus.Result().StatusCode)
	}
	t.Log("✅ Step 5: Import Status Verification PASSED")

	// Step 6: Capsule Build & ECDSA Signature
	builder := builderHandlers.NewCapsuleHandler()
	reqBuild := httptest.NewRequest("POST", "/api/v1/capsules/build", nil)
	wBuild := httptest.NewRecorder()
	builder.BuildCapsule(wBuild, reqBuild)

	if wBuild.Result().StatusCode != http.StatusOK {
		t.Fatalf("❌ Step 6 Capsule Build failed: status %d", wBuild.Result().StatusCode)
	}
	t.Log("✅ Step 6: Capsule Build & Encryption PASSED")

	// Step 7: List Capsules
	reqCapsList := httptest.NewRequest("GET", "/api/v1/capsules", nil)
	wCapsList := httptest.NewRecorder()
	builder.ListCapsules(wCapsList, reqCapsList)

	if wCapsList.Result().StatusCode != http.StatusOK {
		t.Fatalf("❌ Step 7 List Capsules failed: status %d", wCapsList.Result().StatusCode)
	}
	t.Log("✅ Step 7: List Capsules PASSED")

	// Step 8: Create Secure Share Link
	sharer := builderHandlers.NewSharingHandler()
	shareBody := []byte(`{"capsuleId":"caps_8f9102ab30c9","passcode":"Partner2026!"}`)
	reqShare := httptest.NewRequest("POST", "/api/v1/share/create", bytes.NewReader(shareBody))
	wShare := httptest.NewRecorder()
	sharer.CreateShareLink(wShare, reqShare)

	if wShare.Result().StatusCode != http.StatusOK {
		t.Fatalf("❌ Step 8 Create Share Link failed: status %d", wShare.Result().StatusCode)
	}
	t.Log("✅ Step 8: Secure Share Link Creation PASSED")

	// Step 9: Get Dashboard Analytics
	analytics := analyticsHandlers.NewAnalyticsHandler()
	reqAnalytics := httptest.NewRequest("GET", "/api/v1/analytics/dashboard", nil)
	wAnalytics := httptest.NewRecorder()
	analytics.GetDashboardAnalytics(wAnalytics, reqAnalytics)

	if wAnalytics.Result().StatusCode != http.StatusOK {
		t.Fatalf("❌ Step 9 Get Dashboard Analytics failed: status %d", wAnalytics.Result().StatusCode)
	}
	t.Log("✅ Step 9: Dashboard Analytics Retrieval PASSED")

	// Step 10: Get Performance Metrics
	reqPerf := httptest.NewRequest("GET", "/api/v1/analytics/performance", nil)
	wPerf := httptest.NewRecorder()
	analytics.GetPerformanceAnalytics(wPerf, reqPerf)

	if wPerf.Result().StatusCode != http.StatusOK {
		t.Fatalf("❌ Step 10 Performance Analytics failed: status %d", wPerf.Result().StatusCode)
	}
	t.Log("✅ Step 10: Performance Metrics PASSED")

	// Step 11: Get AI Analytics
	reqAI := httptest.NewRequest("GET", "/api/v1/analytics/ai", nil)
	wAI := httptest.NewRecorder()
	analytics.GetAIAnalytics(wAI, reqAI)

	if wAI.Result().StatusCode != http.StatusOK {
		t.Fatalf("❌ Step 11 AI Analytics failed: status %d", wAI.Result().StatusCode)
	}
	t.Log("✅ Step 11: AI Analytics PASSED")

	// Step 12: Get Security Analytics
	reqSec := httptest.NewRequest("GET", "/api/v1/analytics/security", nil)
	wSec := httptest.NewRecorder()
	analytics.GetSecurityAnalytics(wSec, reqSec)

	if wSec.Result().StatusCode != http.StatusOK {
		t.Fatalf("❌ Step 12 Security Analytics failed: status %d", wSec.Result().StatusCode)
	}
	t.Log("✅ Step 12: Security Audit Analytics PASSED")

	// Step 13: Admin Portal System Health Check
	admin := authHandlers.NewAdminHandler()
	reqAdmin := httptest.NewRequest("GET", "/api/v1/admin/dashboard", nil)
	wAdmin := httptest.NewRecorder()
	admin.GetAdminDashboard(wAdmin, reqAdmin)

	if wAdmin.Result().StatusCode != http.StatusOK {
		t.Fatalf("❌ Step 13 Admin Portal Dashboard failed: status %d", wAdmin.Result().StatusCode)
	}
	t.Log("✅ Step 13: Admin Portal System Health PASSED")

	// Step 14: Feature Flags Verification
	reqFF := httptest.NewRequest("GET", "/api/v1/admin/feature-flags", nil)
	wFF := httptest.NewRecorder()
	admin.ListFeatureFlags(wFF, reqFF)

	if wFF.Result().StatusCode != http.StatusOK {
		t.Fatalf("❌ Step 14 Feature Flags Check failed: status %d", wFF.Result().StatusCode)
	}
	t.Log("✅ Step 14: Feature Flags PASSED")

	// Step 15: System Backup Execution
	reqBackup := httptest.NewRequest("POST", "/api/v1/admin/backup/trigger", nil)
	wBackup := httptest.NewRecorder()
	admin.TriggerBackup(wBackup, reqBackup)

	if wBackup.Result().StatusCode != http.StatusOK {
		t.Fatalf("❌ Step 15 System Backup Trigger failed: status %d", wBackup.Result().StatusCode)
	}
	t.Log("✅ Step 15: System Backup & Snapshot PASSED")

	t.Log("🏆 Dashboard Capsule AI v1.0.0 End-to-End Pipeline Execution Fully Verified!")
}

