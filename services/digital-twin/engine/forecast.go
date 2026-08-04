package engine

import (
	"fmt"
	"math"
	"time"
)

type ForecastPoint struct {
	Period          string  `json:"period"`
	Historical      float64 `json:"historical,omitempty"`
	Forecasted      float64 `json:"forecasted"`
	ConfidenceLower float64 `json:"confidenceLower"`
	ConfidenceUpper float64 `json:"confidenceUpper"`
}

type ForecastResult struct {
	MetricName     string          `json:"metricName"`
	Domain         string          `json:"domain"`
	Unit           string          `json:"unit"`
	HistoricalAvg  float64         `json:"historicalAvg"`
	ForecastAvg    float64         `json:"forecastAvg"`
	GrowthRatePct  float64         `json:"growthRatePct"`
	Timeline       []ForecastPoint `json:"timeline"`
	GeneratedAt    time.Time       `json:"generatedAt"`
}

type ForecastEngine struct{}

func NewForecastEngine() *ForecastEngine {
	return &ForecastEngine{}
}

func (f *ForecastEngine) GenerateForecast(metricName, domain string, baseValue float64, growthFactor float64) *ForecastResult {
	if baseValue == 0 {
		baseValue = 1000000.0
	}

	var points []ForecastPoint
	months := []string{"Jan 2026", "Feb 2026", "Mar 2026", "Apr 2026", "May 2026", "Jun 2026", "Jul 2026", "Aug 2026", "Sep 2026", "Oct 2026", "Nov 2026", "Dec 2026"}

	curr := baseValue
	monthlyGrowth := (growthFactor - 1.0) / 12.0

	for i, m := range months {
		curr = curr * (1.0 + monthlyGrowth + (float64(i%3)*0.005 - 0.005))
		uncertainty := curr * (0.05 + float64(i)*0.008)

		points = append(points, ForecastPoint{
			Period:          m,
			Forecasted:      math.Round(curr*100) / 100,
			ConfidenceLower: math.Round((curr-uncertainty)*100) / 100,
			ConfidenceUpper: math.Round((curr+uncertainty)*100) / 100,
		})
	}

	avgForecast := curr
	growthPct := ((avgForecast - baseValue) / baseValue) * 100.0

	return &ForecastResult{
		MetricName:    metricName,
		Domain:        domain,
		Unit:          "$",
		HistoricalAvg: baseValue,
		ForecastAvg:   math.Round(avgForecast*100) / 100,
		GrowthRatePct: math.Round(growthPct*100) / 100,
		Timeline:      points,
		GeneratedAt:   time.Now(),
	}
}
