package memory

import (
	"sync"
	"time"
)

type MemoryRecord struct {
	ID        string      `json:"id"`
	Category  string      `json:"category"` // short_term, long_term, conversation, dashboard, org, task
	Key       string      `json:"key"`
	Value     interface{} `json:"value"`
	AgentID   string      `json:"agentId,omitempty"`
	CreatedAt time.Time   `json:"createdAt"`
}

type SharedMemoryStore struct {
	mu            sync.RWMutex
	shortTerm     map[string]interface{}
	longTerm      map[string]interface{}
	dashboardMem  map[string]map[string]interface{}
	orgMem        map[string]map[string]interface{}
	conversations []map[string]string
	records       []MemoryRecord
}

func NewSharedMemoryStore() *SharedMemoryStore {
	return &SharedMemoryStore{
		shortTerm:    make(map[string]interface{}),
		longTerm:     make(map[string]interface{}),
		dashboardMem: make(map[string]map[string]interface{}),
		orgMem:       make(map[string]map[string]interface{}),
	}
}

func (s *SharedMemoryStore) GetShortTerm(key string) (interface{}, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	val, exists := s.shortTerm[key]
	return val, exists
}

func (s *SharedMemoryStore) SetShortTerm(key string, val interface{}) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.shortTerm[key] = val
	s.records = append(s.records, MemoryRecord{
		ID:        key,
		Category:  "short_term",
		Key:       key,
		Value:     val,
		CreatedAt: time.Now(),
	})
}

func (s *SharedMemoryStore) GetDashboardMemory(dashboardID, key string) (interface{}, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	if dMap, exists := s.dashboardMem[dashboardID]; exists {
		val, found := dMap[key]
		return val, found
	}
	return nil, false
}

func (s *SharedMemoryStore) SetDashboardMemory(dashboardID, key string, val interface{}) {
	s.mu.Lock()
	defer s.mu.Unlock()
	if _, exists := s.dashboardMem[dashboardID]; !exists {
		s.dashboardMem[dashboardID] = make(map[string]interface{})
	}
	s.dashboardMem[dashboardID][key] = val
	s.records = append(s.records, MemoryRecord{
		ID:        dashboardID + "_" + key,
		Category:  "dashboard",
		Key:       key,
		Value:     val,
		CreatedAt: time.Now(),
	})
}

func (s *SharedMemoryStore) AppendMessage(agentID, role, content string) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.conversations = append(s.conversations, map[string]string{
		"agentId":   agentID,
		"role":      role,
		"content":   content,
		"timestamp": time.Now().Format(time.RFC3339),
	})
}

func (s *SharedMemoryStore) GetConversations() []map[string]string {
	s.mu.RLock()
	defer s.mu.RUnlock()
	copied := make([]map[string]string, len(s.conversations))
	copy(copied, s.conversations)
	return copied
}

func (s *SharedMemoryStore) ListRecords() []MemoryRecord {
	s.mu.RLock()
	defer s.mu.RUnlock()
	copied := make([]MemoryRecord, len(s.records))
	copy(copied, s.records)
	return copied
}
