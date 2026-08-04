package tests

import (
	"net/http"
	"net/http/httptest"
	"testing"

	analyticsHandlers "github.com/dashboard-capsule-ai/services/analytics-service/handlers"
	authHandlers "github.com/dashboard-capsule-ai/services/auth-service/handlers"
	builderHandlers "github.com/dashboard-capsule-ai/services/capsule-builder/handlers"
)

func TestVersion2FullIntegrationPipeline(t *testing.T) {
	// 1. Auth & Admin Setup
	admin := authHandlers.NewAdminHandler()
	reqAdmin := httptest.NewRequest("GET", "/api/v1/admin/dashboard", nil)
	wAdmin := httptest.NewRecorder()
	admin.GetAdminDashboard(wAdmin, reqAdmin)
	if wAdmin.Result().StatusCode != http.StatusOK {
		t.Fatalf("V2 Integration Step 1 Admin Dashboard failed: status %d", wAdmin.Result().StatusCode)
	}

	// 2. Plugin Marketplace Query
	plugin := builderHandlers.NewPluginHandler()
	reqMarketplace := httptest.NewRequest("GET", "/api/v1/marketplace", nil)
	wMarketplace := httptest.NewRecorder()
	plugin.ListMarketplacePlugins(wMarketplace, reqMarketplace)
	if wMarketplace.Result().StatusCode != http.StatusOK {
		t.Fatalf("V2 Integration Step 2 Marketplace failed: status %d", wMarketplace.Result().StatusCode)
	}

	// 3. Analytics & Telemetry Check
	analytics := analyticsHandlers.NewAnalyticsHandler()
	reqAnalytics := httptest.NewRequest("GET", "/api/v1/analytics/dashboard", nil)
	wAnalytics := httptest.NewRecorder()
	analytics.GetDashboardAnalytics(wAnalytics, reqAnalytics)
	if wAnalytics.Result().StatusCode != http.StatusOK {
		t.Fatalf("V2 Integration Step 3 Analytics failed: status %d", wAnalytics.Result().StatusCode)
	}
}
