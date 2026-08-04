package main

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/dashboard-capsule-ai/services/analytics-service/handlers"
)

func TestGetDashboardAnalytics(t *testing.T) {
	handler := handlers.NewAnalyticsHandler()

	req := httptest.NewRequest("GET", "/api/v1/analytics/dashboard", nil)
	w := httptest.NewRecorder()

	handler.GetDashboardAnalytics(w, req)

	resp := w.Result()
	if resp.StatusCode != http.StatusOK {
		t.Errorf("Expected status 200 OK, got %d", resp.StatusCode)
	}
}

func TestGetPerformanceAnalytics(t *testing.T) {
	handler := handlers.NewAnalyticsHandler()

	req := httptest.NewRequest("GET", "/api/v1/analytics/performance", nil)
	w := httptest.NewRecorder()

	handler.GetPerformanceAnalytics(w, req)

	resp := w.Result()
	if resp.StatusCode != http.StatusOK {
		t.Errorf("Expected status 200 OK, got %d", resp.StatusCode)
	}
}
