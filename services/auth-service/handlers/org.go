package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/dashboard-capsule-ai/services/auth-service/models"
	"github.com/dashboard-capsule-ai/services/auth-service/services"
)

type OrgHandler struct{}

func NewOrgHandler() *OrgHandler {
	return &OrgHandler{}
}

func (h *OrgHandler) InviteMember(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req models.InviteMemberRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.Email == "" {
		writeJSONError(w, http.StatusBadRequest, "INVALID_INPUT", "Valid member email required")
		return
	}

	inviteToken, _ := services.GenerateSecureToken(24)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(models.APIResponse{
		Success: true,
		Data: map[string]interface{}{
			"inviteToken": inviteToken,
			"email":       req.Email,
			"role":        req.Role,
			"status":      "PENDING",
			"inviteUrl":   "https://app.capsule.ai/auth/accept-invite?token=" + inviteToken,
		},
	})
}
