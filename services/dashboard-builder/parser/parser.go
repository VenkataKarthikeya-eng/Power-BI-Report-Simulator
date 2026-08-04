package parser

import (
	"fmt"
	"strings"
)

type DomainType string

const (
	DomainSales         DomainType = "SALES"
	DomainFinance       DomainType = "FINANCE"
	DomainMarketing     DomainType = "MARKETING"
	DomainHR            DomainType = "HR"
	DomainOperations    DomainType = "OPERATIONS"
	DomainSupplyChain   DomainType = "SUPPLY_CHAIN"
	DomainHealthcare    DomainType = "HEALTHCARE"
	DomainManufacturing DomainType = "MANUFACTURING"
	DomainRetail        DomainType = "RETAIL"
	DomainCustom        DomainType = "CUSTOM"
)

type ParsedIntent struct {
	Domain              DomainType `json:"domain"`
	PrimaryMetric       string     `json:"primaryMetric"`
	TargetTimeframe     string     `json:"targetTimeframe"`
	DetectedEntities    []string   `json:"detectedEntities"`
	RequestedVisualsCount int      `json:"requestedVisualsCount"`
	SafetyScore         float64    `json:"safetyScore"`
}

type PromptParser struct{}

func NewPromptParser() *PromptParser {
	return &PromptParser{}
}

func (p *PromptParser) ParsePrompt(rawPrompt string) (*ParsedIntent, error) {
	if strings.TrimSpace(rawPrompt) == "" {
		return nil, fmt.Errorf("prompt cannot be empty")
	}

	// Prompt injection scanning
	lowered := strings.ToLower(rawPrompt)
	if strings.Contains(lowered, "drop table") || strings.Contains(lowered, "ignore instructions") || strings.Contains(lowered, "<script>") {
		return nil, fmt.Errorf("prompt validation security check failed: suspicious payload detected")
	}

	intent := &ParsedIntent{
		Domain:                p.detectDomain(lowered),
		PrimaryMetric:         p.detectPrimaryMetric(lowered),
		TargetTimeframe:       p.detectTimeframe(lowered),
		DetectedEntities:      p.detectEntities(lowered),
		RequestedVisualsCount: 6,
		SafetyScore:           1.0,
	}

	return intent, nil
}

func (p *PromptParser) detectDomain(text string) DomainType {
	switch {
	case strings.Contains(text, "sales") || strings.Contains(text, "revenue") || strings.Contains(text, "quota"):
		return DomainSales
	case strings.Contains(text, "finance") || strings.Contains(text, "cost") || strings.Contains(text, "margin") || strings.Contains(text, "profit"):
		return DomainFinance
	case strings.Contains(text, "marketing") || strings.Contains(text, "campaign") || strings.Contains(text, "click"):
		return DomainMarketing
	case strings.Contains(text, "hr") || strings.Contains(text, "human resource") || strings.Contains(text, "attrition") || strings.Contains(text, "hiring"):
		return DomainHR
	case strings.Contains(text, "operation") || strings.Contains(text, "delay") || strings.Contains(text, "transit"):
		return DomainOperations
	case strings.Contains(text, "supply chain") || strings.Contains(text, "logistics") || strings.Contains(text, "carrier"):
		return DomainSupplyChain
	case strings.Contains(text, "health") || strings.Contains(text, "patient") || strings.Contains(text, "hospital"):
		return DomainHealthcare
	case strings.Contains(text, "manufactur") || strings.Contains(text, "factory") || strings.Contains(text, "plant"):
		return DomainManufacturing
	case strings.Contains(text, "retail") || strings.Contains(text, "store") || strings.Contains(text, "sku"):
		return DomainRetail
	default:
		return DomainCustom
	}
}

func (p *PromptParser) detectPrimaryMetric(text string) string {
	if strings.Contains(text, "margin") {
		return "Freight Margin"
	} else if strings.Contains(text, "attrition") {
		return "Employee Attrition Rate"
	} else if strings.Contains(text, "revenue") {
		return "Total Revenue"
	}
	return "Total Volume"
}

func (p *PromptParser) detectTimeframe(text string) string {
	if strings.Contains(text, "12 month") || strings.Contains(text, "year") {
		return "Trailing 12 Months (T12M)"
	} else if strings.Contains(text, "quarter") || strings.Contains(text, "q3") {
		return "Q3 Current Fiscal Period"
	}
	return "All-Time Historical"
}

func (p *PromptParser) detectEntities(text string) []string {
	var entities []string
	if strings.Contains(text, "carrier") || strings.Contains(text, "fedex") || strings.Contains(text, "dhl") {
		entities = append(entities, "CarrierCode", "ShipmentID")
	}
	if strings.Contains(text, "region") || strings.Contains(text, "city") {
		entities = append(entities, "DestinationCity", "CountryRegion")
	}
	if len(entities) == 0 {
		entities = append(entities, "Category", "PeriodDate")
	}
	return entities
}
