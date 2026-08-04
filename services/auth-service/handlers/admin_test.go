package handlers

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestGetAdminDashboard(t *testing.T) {
	handler := NewAdminHandler()

	req := httptest.NewRequest("GET", "/api/v1/admin/dashboard", nil)
	w := httptest.NewRecorder()

	handler.GetAdminDashboard(w, req)

	resp := w.Result()
	if resp.StatusCode != http.StatusOK {
		t.Errorf("Expected status 200 OK, got %d", resp.StatusCode)
	}
}

func TestTriggerBackup(t *testing.T) {
	handler := NewAdminHandler()

	req := httptest.NewRequest("POST", "/api/v1/admin/backup", nil)
	w := httptest.NewRecorder()

	handler.TriggerBackup(w, req)

	resp := w.Result()
	if resp.StatusCode != http.StatusOK {
		t.Errorf("Expected status 200 OK, got %d", resp.StatusCode)
	}
}
