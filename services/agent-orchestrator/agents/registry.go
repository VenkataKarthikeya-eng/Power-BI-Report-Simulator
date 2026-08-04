package agents

import (
	"fmt"
	"sync"
)

type AgentRegistry struct {
	mu     sync.RWMutex
	agents map[string]Agent
}

var globalRegistry = NewAgentRegistry()

func NewAgentRegistry() *AgentRegistry {
	return &AgentRegistry{
		agents: make(map[string]Agent),
	}
}

func GetGlobalRegistry() *AgentRegistry {
	return globalRegistry
}

func (r *AgentRegistry) Register(agent Agent) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	id := agent.Manifest().ID
	if id == "" {
		return fmt.Errorf("cannot register agent with empty ID")
	}

	r.agents[id] = agent
	return nil
}

func (r *AgentRegistry) Get(id string) (Agent, bool) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	agent, exists := r.agents[id]
	return agent, exists
}

func (r *AgentRegistry) List() []AgentManifest {
	r.mu.RLock()
	defer r.mu.RUnlock()

	manifests := make([]AgentManifest, 0, len(r.agents))
	for _, a := range r.agents {
		manifests = append(manifests, a.Manifest())
	}
	return manifests
}

func (r *AgentRegistry) FindByCapability(cap Capability) []Agent {
	r.mu.RLock()
	defer r.mu.RUnlock()

	var matched []Agent
	for _, a := range r.agents {
		if a.CanHandle(cap) {
			matched = append(matched, a)
		}
	}
	return matched
}
