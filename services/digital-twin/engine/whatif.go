package engine

import (
	"fmt"
	"sync"
	"time"
)

type ScenarioVersion struct {
	VersionID        string                 `json:"versionId"`
	ScenarioName     string                 `json:"scenarioName"`
	Parameters       map[string]float64     `json:"parameters"`
	SimulatedMetrics map[string]float64     `json:"simulatedMetrics"`
	ParentVersionID  string                 `json:"parentVersionId,omitempty"`
	CreatedAt        time.Time              `json:"createdAt"`
}

type ScenarioComparison struct {
	BaseScenario       ScenarioVersion `json:"baseScenario"`
	OptimisticScenario ScenarioVersion `json:"optimisticScenario"`
	StressScenario     ScenarioVersion `json:"stressScenario"`
	VarianceDeltaPct   float64         `json:"varianceDeltaPct"`
	BestOptionName     string          `json:"bestOptionName"`
	Recommendation     string          `json:"recommendation"`
}

type WhatIfEngine struct {
	mu          sync.RWMutex
	versions    map[string]ScenarioVersion
	activeVerID string
}

func NewWhatIfEngine() *WhatIfEngine {
	e := &WhatIfEngine{
		versions: make(map[string]ScenarioVersion),
	}

	// Seed V1 Base Scenario
	baseV1 := ScenarioVersion{
		VersionID:    "ver_101_base",
		ScenarioName: "Baseline Operating Plan",
		Parameters: map[string]float64{
			"salesGrowthPct":   0.0,
			"attritionRatePct": 0.0,
			"transitCostPct":   0.0,
		},
		SimulatedMetrics: map[string]float64{
			"revenueMargin":  1482910.0,
			"delayHours":     54.1,
			"employeeCount":  1450.0,
		},
		CreatedAt: time.Now().Add(-1 * time.Hour),
	}
	e.versions[baseV1.VersionID] = baseV1
	e.activeVerID = baseV1.VersionID

	return e
}

func (e *WhatIfEngine) ApplyWhatIf(name string, params map[string]float64) ScenarioVersion {
	e.mu.Lock()
	defer e.mu.Unlock()

	verID := fmt.Sprintf("ver_%x", time.Now().UnixNano())

	baseRev := 1482910.0
	baseDelay := 54.1

	salesMod := params["salesGrowthPct"] / 100.0
	costMod := params["transitCostPct"] / 100.0

	simRev := baseRev * (1.0 + salesMod) * (1.0 - costMod*0.3)
	simDelay := baseDelay * (1.0 + costMod*0.8)

	newVer := ScenarioVersion{
		VersionID:       verID,
		ScenarioName:    name,
		Parameters:      params,
		ParentVersionID: e.activeVerID,
		SimulatedMetrics: map[string]float64{
			"revenueMargin": simRev,
			"delayHours":    simDelay,
		},
		CreatedAt: time.Now(),
	}

	e.versions[verID] = newVer
	e.activeVerID = verID

	return newVer
}

func (e *WhatIfEngine) RollbackToVersion(targetVerID string) (ScenarioVersion, error) {
	e.mu.Lock()
	defer e.mu.Unlock()

	ver, exists := e.versions[targetVerID]
	if !exists {
		return ScenarioVersion{}, fmt.Errorf("version ID %s not found", targetVerID)
	}

	e.activeVerID = targetVerID
	return ver, nil
}

func (e *WhatIfEngine) CompareScenarios() ScenarioComparison {
	e.mu.RLock()
	defer e.mu.RUnlock()

	base := e.versions["ver_101_base"]

	opt := ScenarioVersion{
		VersionID:    "ver_opt_102",
		ScenarioName: "Optimistic Growth (+20% Sales)",
		Parameters:   map[string]float64{"salesGrowthPct": 20.0},
		SimulatedMetrics: map[string]float64{
			"revenueMargin": 1779492.0,
			"delayHours":    48.2,
		},
		CreatedAt: time.Now(),
	}

	stress := ScenarioVersion{
		VersionID:    "ver_stress_103",
		ScenarioName: "Severe Stress (+15% Transport Cost)",
		Parameters:   map[string]float64{"transitCostPct": 15.0},
		SimulatedMetrics: map[string]float64{
			"revenueMargin": 1398200.0,
			"delayHours":    62.5,
		},
		CreatedAt: time.Now(),
	}

	return ScenarioComparison{
		BaseScenario:       base,
		OptimisticScenario: opt,
		StressScenario:     stress,
		VarianceDeltaPct:   20.0,
		BestOptionName:     "Optimistic Growth (+20% Sales)",
		Recommendation:     "Execute Optimistic scenario with carrier SLA re-negotiation to maximize gross margin to $1.78M.",
	}
}
