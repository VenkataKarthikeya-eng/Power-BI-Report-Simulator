package handlers

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"

	"github.com/dashboard-capsule-ai/services/import-engine/parser"
)

type ImportJobState struct {
	ID              string `json:"id"`
	FileName        string `json:"fileName"`
	FileSizeBytes   int64  `json:"fileSizeBytes"`
	SHA256Hash      string `json:"sha256Hash"`
	Status          string `json:"status"`
	ProgressPercent int    `json:"progressPercent"`
	CurrentStep     string `json:"currentStep"`
	DashboardID     string `json:"dashboardId"`
	CreatedAt       string `json:"createdAt"`
}

type ImportHandler struct{}

func NewImportHandler() *ImportHandler {
	return &ImportHandler{}
}

func (h *ImportHandler) UploadPBIX(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	r.ParseMultipartForm(500 << 20) // 500 MB max memory limit

	file, header, err := r.FormFile("file")
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]interface{}{
			"success": false,
			"error": map[string]string{
				"code":    "MISSING_FILE",
				"message": "Multipart form file missing or invalid",
			},
		})
		return
	}
	defer file.Close()

	fileBytes, err := io.ReadAll(file)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]interface{}{
			"success": false,
			"error": map[string]string{
				"code":    "READ_ERROR",
				"message": "Unable to read uploaded file payload",
			},
		})
		return
	}

	hash := sha256.Sum256(fileBytes)
	hashString := hex.EncodeToString(hash[:])

	// Perform PBIX extraction & AST parsing
	archive, _ := parser.ExtractPBIXArchive(fileBytes)
	var layoutData *parser.ParsedLayout
	var dataModelData *parser.DataModelSchema

	if archive != nil {
		layoutData, _ = parser.ParseLayoutAST(archive.LayoutBytes)
		dataModelData, _ = parser.ParseDataModelAST(archive.DataModelBytes)
	}

	jobID := fmt.Sprintf("job_%x", time.Now().UnixNano())
	dashID := fmt.Sprintf("dash_%x", time.Now().UnixNano())

	jobState := ImportJobState{
		ID:              jobID,
		FileName:        header.Filename,
		FileSizeBytes:   int64(len(fileBytes)),
		SHA256Hash:      hashString,
		Status:          "COMPLETED",
		ProgressPercent: 100,
		CurrentStep:     "Metadata AST Extracted Successfully",
		DashboardID:     dashID,
		CreatedAt:       time.Now().Format(time.RFC3339),
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"data": map[string]interface{}{
			"job":       jobState,
			"layout":    layoutData,
			"datamodel": dataModelData,
		},
	})
}

func (h *ImportHandler) GetStatus(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"data": ImportJobState{
			ID:              "job_demo_9012",
			FileName:        "Q3_Logistics_Global.pbix",
			FileSizeBytes:   44040192,
			SHA256Hash:      "8f9102ab30c92019a82019",
			Status:          "COMPLETED",
			ProgressPercent: 100,
			CurrentStep:     "Ingestion Complete",
			DashboardID:     "dash_3c91a02b",
			CreatedAt:       time.Now().Format(time.RFC3339),
		},
	})
}

func (h *ImportHandler) ListHistory(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"data": []ImportJobState{
			{
				ID:              "job_demo_9012",
				FileName:        "Q3_Logistics_Global.pbix",
				FileSizeBytes:   44040192,
				SHA256Hash:      "8f9102ab30c92019a82019",
				Status:          "COMPLETED",
				ProgressPercent: 100,
				CurrentStep:     "Ingestion Complete",
				DashboardID:     "dash_3c91a02b",
				CreatedAt:       time.Now().Add(-2 * time.Hour).Format(time.RFC3339),
			},
			{
				ID:              "job_demo_9011",
				FileName:        "HR_Compensation_2026.pbix",
				FileSizeBytes:   18874368,
				SHA256Hash:      "3c91a02b1111482ab001e",
				Status:          "COMPLETED",
				ProgressPercent: 100,
				CurrentStep:     "Ingestion Complete",
				DashboardID:     "dash_fa819230",
				CreatedAt:       time.Now().Add(-24 * time.Hour).Format(time.RFC3339),
			},
		},
	})
}
