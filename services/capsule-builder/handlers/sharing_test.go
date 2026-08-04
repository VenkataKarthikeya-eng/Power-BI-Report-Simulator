package handlers

import (
	"bytes"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestCreateShareLink(t *testing.T) {
	handler := NewSharingHandler()
	reqBody := []byte(`{"capsuleId":"caps_8f9102ab30c9","passcode":"Partner2026!","allowedDomain":"partnercorp.com","allowDownload":false}`)

	req := httptest.NewRequest("POST", "/api/v1/share/create", bytes.NewReader(reqBody))
	w := httptest.NewRecorder()

	handler.CreateShareLink(w, req)

	resp := w.Result()
	if resp.StatusCode != http.StatusOK {
		t.Errorf("Expected status 200 OK, got %d", resp.StatusCode)
	}
}

func TestVerifyPasscode(t *testing.T) {
	handler := NewSharingHandler()
	reqBody := []byte(`{"shareToken":"v98f21a09b","passcode":"Partner2026!"}`)

	req := httptest.NewRequest("POST", "/api/v1/share/verify", bytes.NewReader(reqBody))
	w := httptest.NewRecorder()

	handler.VerifyPasscode(w, req)

	resp := w.Result()
	if resp.StatusCode != http.StatusOK {
		t.Errorf("Expected status 200 OK, got %d", resp.StatusCode)
	}
}
