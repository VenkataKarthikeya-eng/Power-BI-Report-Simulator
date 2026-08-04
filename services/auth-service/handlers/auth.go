package handlers

import (
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"github.com/dashboard-capsule-ai/services/auth-service/models"
	"github.com/dashboard-capsule-ai/services/auth-service/services"
)

type AuthHandler struct{}

func NewAuthHandler() *AuthHandler {
	return &AuthHandler{}
}

func (h *AuthHandler) Register(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req models.RegisterRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSONError(w, http.StatusBadRequest, "INVALID_BODY", "Invalid JSON payload")
		return
	}

	if strings.TrimSpace(req.Email) == "" || strings.TrimSpace(req.Password) == "" || strings.TrimSpace(req.FullName) == "" {
		writeJSONError(w, http.StatusBadRequest, "VALIDATION_FAILED", "Email, password, and full name are required")
		return
	}

	if len(req.Password) < 8 {
		writeJSONError(w, http.StatusBadRequest, "WEAK_PASSWORD", "Password must be at least 8 characters long")
		return
	}

	orgName := req.OrganizationName
	if orgName == "" {
		orgName = req.FullName + "'s Organization"
	}

	userID := "usr_" + generateID()
	orgID := "org_" + generateID()

	accessToken, err := services.GenerateAccessToken(userID, orgID, req.Email, string(models.RoleOrgAdmin), 900)
	if err != nil {
		writeJSONError(w, http.StatusInternalServerError, "SERVER_ERROR", "Failed to generate token")
		return
	}

	refreshToken, err := services.GenerateSecureToken(32)
	if err != nil {
		writeJSONError(w, http.StatusInternalServerError, "SERVER_ERROR", "Failed to generate refresh token")
		return
	}

	resp := models.AuthResponse{
		User: models.UserDTO{
			ID:             userID,
			OrganizationID: orgID,
			Email:          req.Email,
			FullName:       req.FullName,
			Role:           models.RoleOrgAdmin,
			Status:         "UNVERIFIED",
			IsMFAEnabled:   false,
			CreatedAt:      time.Now(),
		},
		Organization: models.OrganizationDTO{
			ID:        orgID,
			Name:      orgName,
			Slug:      strings.ToLower(strings.ReplaceAll(orgName, " ", "-")),
			PlanTier:  "ENTERPRISE",
			CreatedAt: time.Now(),
		},
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		ExpiresIn:    900,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(models.APIResponse{Success: true, Data: resp})
}

func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req models.LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSONError(w, http.StatusBadRequest, "INVALID_BODY", "Invalid JSON payload")
		return
	}

	if strings.TrimSpace(req.Email) == "" || strings.TrimSpace(req.Password) == "" {
		writeJSONError(w, http.StatusBadRequest, "VALIDATION_FAILED", "Email and password are required")
		return
	}

	userID := "usr_demo_10921"
	orgID := "org_acme_90123"

	accessToken, err := services.GenerateAccessToken(userID, orgID, req.Email, string(models.RoleDeveloper), 900)
	if err != nil {
		writeJSONError(w, http.StatusInternalServerError, "SERVER_ERROR", "Failed to generate access token")
		return
	}

	refreshToken, err := services.GenerateSecureToken(32)
	if err != nil {
		writeJSONError(w, http.StatusInternalServerError, "SERVER_ERROR", "Failed to generate refresh token")
		return
	}

	resp := models.AuthResponse{
		User: models.UserDTO{
			ID:             userID,
			OrganizationID: orgID,
			Email:          req.Email,
			FullName:       "Alex Rivera",
			Role:           models.RoleDeveloper,
			Status:         "ACTIVE",
			IsMFAEnabled:   false,
			CreatedAt:      time.Now(),
		},
		Organization: models.OrganizationDTO{
			ID:        orgID,
			Name:      "Acme Global Enterprise",
			Slug:      "acme-global",
			PlanTier:  "ENTERPRISE",
			CreatedAt: time.Now(),
		},
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		ExpiresIn:    900,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(models.APIResponse{Success: true, Data: resp})
}

func (h *AuthHandler) Refresh(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req models.RefreshTokenRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.RefreshToken == "" {
		writeJSONError(w, http.StatusBadRequest, "INVALID_TOKEN", "Valid refresh token required")
		return
	}

	newAccessToken, err := services.GenerateAccessToken("usr_demo_10921", "org_acme_90123", "alex@acme.com", string(models.RoleDeveloper), 900)
	if err != nil {
		writeJSONError(w, http.StatusInternalServerError, "SERVER_ERROR", "Failed to refresh token")
		return
	}

	newRefreshToken, _ := services.GenerateSecureToken(32)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(models.APIResponse{
		Success: true,
		Data: map[string inhabit]{
			"accessToken":  newAccessToken,
			"refreshToken": newRefreshToken,
			"expiresIn":    900,
		},
	})
}

func (h *AuthHandler) Logout(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(models.APIResponse{Success: true, Data: map[string]string{"message": "Logged out successfully"}})
}

func writeJSONError(w http.ResponseWriter, status int, code, message string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(models.APIResponse{
		Success: false,
		Error: &models.APIError{
			Code:    code,
			Message: message,
		},
	})
}

type inhabit = interface{}

func generateID() string {
	token, _ := services.GenerateSecureToken(8)
	return token
}
