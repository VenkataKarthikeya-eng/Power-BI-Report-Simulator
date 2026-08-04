package tests

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/dashboard-capsule-ai/services/realtime-service/engine"
	"github.com/dashboard-capsule-ai/services/realtime-service/handlers"
	"github.com/dashboard-capsule-ai/services/realtime-service/hub"
)

func TestRealtimeServicePipeline(t *testing.T) {
	connectionHub := hub.GetGlobalHub()
	realtimeEngine := engine.NewRealtimeEngine()
	handler := handlers.NewRealtimeHandler(connectionHub, realtimeEngine)

	// Test 1: Create Session
	sessBody := []byte(`{"dashboardId":"dash_test_collab","userId":"usr_alex","userName":"Alex Rivera"}`)
	reqSess := httptest.NewRequest("POST", "/api/v2/realtime/session", bytes.NewReader(sessBody))
	wSess := httptest.NewRecorder()
	handler.CreateSession(wSess, reqSess)

	if wSess.Result().StatusCode != http.StatusOK {
		t.Fatalf("CreateSession failed with status %d", wSess.Result().StatusCode)
	}
	t.Log("✅ Step 1: Realtime Session Creation PASSED")

	// Test 2: Query Presence
	reqPres := httptest.NewRequest("GET", "/api/v2/presence?dashboardId=dash_test_collab", nil)
	wPres := httptest.NewRecorder()
	handler.GetPresence(wPres, reqPres)

	if wPres.Result().StatusCode != http.StatusOK {
		t.Fatalf("GetPresence failed with status %d", wPres.Result().StatusCode)
	}
	t.Log("✅ Step 2: Live Presence Retrieval PASSED")

	// Test 3: Post Live Comment with Mentions
	commBody := []byte(`{"dashboardId":"dash_test_collab","userId":"usr_alex","userName":"Alex Rivera","content":"@Priya Check the Freight Margin dip","mentions":["priya@acme.com"]}`)
	reqComm := httptest.NewRequest("POST", "/api/v2/comments", bytes.NewReader(commBody))
	wComm := httptest.NewRecorder()
	handler.CreateComment(wComm, reqComm)

	if wComm.Result().StatusCode != http.StatusCreated {
		t.Fatalf("CreateComment failed with status %d", wComm.Result().StatusCode)
	}
	t.Log("✅ Step 3: Threaded Comment & Mention PASSED")

	// Test 4: Get Replay Timeline
	reqReplay := httptest.NewRequest("GET", "/api/v2/realtime/replay?dashboardId=dash_test_collab", nil)
	wReplay := httptest.NewRecorder()
	handler.GetReplayTimeline(wReplay, reqReplay)

	if wReplay.Result().StatusCode != http.StatusOK {
		t.Fatalf("GetReplayTimeline failed with status %d", wReplay.Result().StatusCode)
	}
	var replayResp map[string]interface{}
	json.NewDecoder(wReplay.Body).Decode(&replayResp)
	t.Log("✅ Step 4: Live Session Replay Timeline PASSED")
}
