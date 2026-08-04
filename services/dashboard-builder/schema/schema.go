package schema

import (
	"fmt"

	"github.com/dashboard-capsule-ai/services/dashboard-builder/parser"
)

type GeneratedKPI struct {
	Name            string `json:"name"`
	TableName       string `json:"tableName"`
	ExpressionDAX   string `json:"expressionDax"`
	FormatString    string `json:"formatString"`
	Description     string `json:"description"`
	ImprovementGain int    `json:"improvementGain"`
}

type DatasetSchemaMapper struct{}

func NewDatasetSchemaMapper() *DatasetSchemaMapper {
	return &DatasetSchemaMapper{}
}

func (m *DatasetSchemaMapper) GenerateKPIMeasures(intent *parser.ParsedIntent) ([]GeneratedKPI, error) {
	var kpis []GeneratedKPI

	switch intent.Domain {
	case parser.DomainSales, parser.DomainFinance:
		kpis = append(kpis, GeneratedKPI{
			Name:            "Total Sales Revenue",
			TableName:       "Fact_Sales",
			ExpressionDAX:   "SUM(Fact_Sales[RevenueAmount])",
			FormatString:    "$#,##0",
			Description:     "Aggregated net sales revenue across active accounts.",
			ImprovementGain: 100,
		}, GeneratedKPI{
			Name:            "Net Profit Margin %",
			TableName:       "Fact_Sales",
			ExpressionDAX:   "DIVIDE(SUM(Fact_Sales[ProfitAmount]), SUM(Fact_Sales[RevenueAmount]), 0)",
			FormatString:    "0.0%",
			Description:     "Ratio of net operating profit to total gross sales.",
			ImprovementGain: 95,
		})
	case parser.DomainHR:
		kpis = append(kpis, GeneratedKPI{
			Name:            "Employee Attrition Rate %",
			TableName:       "Fact_HR",
			ExpressionDAX:   "DIVIDE(COUNTROWS(FILTER(Fact_HR, Fact_HR[Status] = \"Terminated\")), COUNTROWS(Fact_HR), 0)",
			FormatString:    "0.0%",
			Description:     "Annualized voluntary and involuntary employee departure rate.",
			ImprovementGain: 90,
		}, GeneratedKPI{
			Name:            "Total Active Headcount",
			TableName:       "Fact_HR",
			ExpressionDAX:   "CALCULATE(COUNTROWS(Fact_HR), Fact_HR[Status] = \"Active\")",
			FormatString:    "#,##0",
			Description:     "Active full-time equivalent (FTE) headcount across all departments.",
			ImprovementGain: 100,
		})
	default: // SupplyChain / Operations / Custom
		kpis = append(kpis, GeneratedKPI{
			Name:            "Total Freight Margin",
			TableName:       "Fact_Shipments",
			ExpressionDAX:   "SUM(Fact_Shipments[FreightCost])",
			FormatString:    "$#,##0.00",
			Description:     "Total gross freight revenue margin across all shipment transit legs.",
			ImprovementGain: 100,
		}, GeneratedKPI{
			Name:            "Delayed Shipments Count",
			TableName:       "Fact_Shipments",
			ExpressionDAX:   "CALCULATE(COUNTROWS(Fact_Shipments), KEEPFILTERS(Fact_Shipments[TransitDelayHours] > 48))",
			FormatString:    "#,##0",
			Description:     "Refactored KEEPFILTERS measure counting shipments delayed beyond 48-hour SLA.",
			ImprovementGain: 65,
		})
	}

	return kpis, nil
}
