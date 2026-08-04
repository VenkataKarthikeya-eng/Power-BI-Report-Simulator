package handlers

import (
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

type ShareLinkRequest struct {
	CapsuleID       string `json:"capsuleId"`
	Passcode        string `json:"passcode,omitempty"`
	AllowedDomain   string `json:"allowedDomain,omitempty"`
	AllowDownload   bool   `json:"allowDownload"`
	AllowExportData bool   `json:"allowExportData"`
	AllowAICopilot  bool   `json:"allowAiCopilot"`
}

type SharingHandler struct{}

func NewSharingHandler() *SharingHandler {
	return &SharingHandler{}
}

func (h *SharingHandler) CreateShareLink(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req ShareLinkRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		req.CapsuleID = "caps_8f9102ab30c9"
	}

	tokenBytes := make([]byte, 8)
	rand.Read(tokenBytes)
	token := hex.EncodeToString(tokenBytes)

	sharePolicy := map[string]interface{}{
		"id":                fmt.Sprintf("share_%s", token[:8]),
		"capsuleId":         req.CapsuleID,
		"shareToken":        token,
		"passcodeProtected": req.Passcode != "",
		"allowedDomain":     req.AllowedDomain,
		"allowDownload":     req.AllowDownload,
		"allowExportData":   req.AllowExportData,
		"allowAiCopilot":    req.AllowAICopilot,
		"expiresAt":         time.Now().Add(14 * 24 * time.Hour).Format(time.RFC3339),
		"createdAt":         time.Now().Format(time.RFC3339),
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"data":    sharePolicy,
	})
}

func (h *SharingHandler) VerifyPasscode(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"data": map[string]interface{}{
			"verified": true,
			"sessionToken": "sess_verified_9012a8",
		},
	})
}

func (h *SharingHandler) GetReplayEvents(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"data": []map[string]interface{}{
			{
				"stepIndex": 1,
				"eventType": "PAGE_SWITCH",
				"payload":   map[string]string{"targetPage": "Q3 Executive Logistics"},
				"timestamp": "00:00.000",
			},
			{
				"stepIndex": 2,
				"eventType": "CROSS_FILTER",
				"payload":   map[string]string{"visualId": "vis_bar_1", "selectedValue": "FedEx Freight"},
				"timestamp": "00:04.250",
			},
			{
				"stepIndex": 3,
				"eventType": "AI_QUERY",
				"payload":   map[string]string{"query": "What caused transit delays to spike?"},
				"timestamp": "00:12.800",
			},
		},
	})
}
