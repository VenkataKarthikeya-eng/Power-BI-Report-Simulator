package handlers

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestListMarketplacePlugins(t *testing.T) {
	handler := NewPluginHandler()

	req := httptest.NewRequest("GET", "/api/v1/marketplace", nil)
	w := httptest.NewRecorder()

	handler.ListMarketplacePlugins(w, req)

	resp := w.Result()
	if resp.StatusCode != http.StatusOK {
		t.Errorf("Expected status 200 OK, got %d", resp.StatusCode)
	}
}

func TestCreateWebhookSubscription(t *testing.T) {
	handler := NewPluginHandler()

	req := httptest.NewRequest("POST", "/api/v1/webhooks", nil)
	w := httptest.NewRecorder()

	handler.CreateWebhookSubscription(w, req)

	resp := w.Result()
	if resp.StatusCode != http.StatusOK {
		t.Errorf("Expected status 200 OK, got %d", resp.StatusCode)
	}
}
