package monitor

import (
	"fmt"
	"sync"
	"time"
)

type SeverityLevel string

const (
	SeverityCritical SeverityLevel = "CRITICAL"
	SeverityWarning  SeverityLevel = "WARNING"
	SeverityInfo     SeverityLevel = "INFO"
)

type MonitoringRule struct {
	RuleID          string        `json:"ruleId"`
	DashboardID     string        `json:"dashboardId"`
	MetricName      string        `json:"metricName"`
	Condition       string        `json:"condition"` // DECREASE_PCT, INCREASE_PCT, STALE_DATA
	ThresholdValue  float64       `json:"thresholdValue"`
	Severity        SeverityLevel `json:"severity"`
	IsActive        bool          `json:"isActive"`
}

type IntelligenceAlert struct {
	AlertID        string        `json:"alertId"`
	RuleID         string        `json:"ruleId"`
	DashboardID    string        `json:"dashboardId"`
	MetricName     string        `json:"metricName"`
	Title          string        `json:"title"`
	Description    string        `json:"description"`
	Severity       SeverityLevel `json:"severity"`
	DeviationPct   float64       `json:"deviationPct"`
	DetectedAt     time.Time     `json:"detectedAt"`
}

type AutonomousMonitor struct {
	mu     sync.RWMutex
	rules  map[string]MonitoringRule
	alerts map[string][]IntelligenceAlert
}

func NewAutonomousMonitor() *AutonomousMonitor {
	m := &AutonomousMonitor{
		rules:  make(map[string]MonitoringRule),
		alerts: make(map[string][]IntelligenceAlert),
	}

	// Seed default monitoring rules
	r1 := MonitoringRule{
		RuleID:         "rule_101_revenue",
		DashboardID:    "dash_3c91a02b",
		MetricName:     "Freight Revenue Margin",
		Condition:      "DECREASE_PCT",
		ThresholdValue: 10.0,
		Severity:       SeverityCritical,
		IsActive:       true,
	}
	m.rules[r1.RuleID] = r1

	// Seed initial active alert
	m.alerts["dash_3c91a02b"] = []IntelligenceAlert{
		{
			AlertID:      "alt_801",
			RuleID:       "rule_101_revenue",
			DashboardID:  "dash_3c91a02b",
			MetricName:   "DHL Transit Delay Spike",
			Title:        "DHL Transit Delay Spike (+12.6% Variance)",
			Description:  "DHL Express transit delay increased from 48h to 54.1h exceeding SLA threshold.",
			Severity:     SeverityWarning,
			DeviationPct: 12.6,
			DetectedAt:   time.Now().Add(-20 * time.Minute),
		},
	}

	return m
}

func (m *AutonomousMonitor) RegisterRule(rule MonitoringRule) MonitoringRule {
	m.mu.Lock()
	defer m.mu.Unlock()

	rule.RuleID = fmt.Sprintf("rule_%x", time.Now().UnixNano())
	m.rules[rule.RuleID] = rule
	return rule
}

func (m *AutonomousMonitor) ScanDashboard(dashboardID string) []IntelligenceAlert {
	m.mu.Lock()
	defer m.mu.Unlock()

	alerts, exists := m.alerts[dashboardID]
	if !exists {
		alerts = []IntelligenceAlert{
			{
				AlertID:      fmt.Sprintf("alt_%x", time.Now().UnixNano()),
				RuleID:       "rule_101_revenue",
				DashboardID:  dashboardID,
				MetricName:   "Freight Margin",
				Title:        "Freight Revenue Drop Detected (-14.2%)",
				Description:  "Freight margin dropped by 14.2% below trailing 30-day moving average.",
				Severity:     SeverityCritical,
				DeviationPct: 14.2,
				DetectedAt:   time.Now(),
			},
		}
		m.alerts[dashboardID] = alerts
	}

	return alerts
}

func (m *AutonomousMonitor) GetAlerts(dashboardID string) []IntelligenceAlert {
	m.mu.RLock()
	defer m.mu.RUnlock()

	alerts, exists := m.alerts[dashboardID]
	if !exists {
		return []IntelligenceAlert{}
	}
	copied := make([]IntelligenceAlert, len(alerts))
	copy(copied, alerts)
	return copied
}
