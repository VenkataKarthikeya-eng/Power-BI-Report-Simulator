package builder

import (
	"encoding/json"
	"fmt"
	"time"
)

type CapsuleManifest struct {
	MagicHeader           string `json:"magicHeader"`
	SpecVersion           string `json:"specVersion"`
	BIToolAdapter         string `json:"biToolAdapter"`
	CapsuleID             string `json:"capsuleId"`
	DashboardName         string `json:"dashboardName"`
	PBIXFingerprintSHA256 string `json:"pbixFingerprintSha256"`
	FileSizeBytes         int64  `json:"fileSizeBytes"`
	UncompressedSizeBytes int64  `json:"uncompressedSizeBytes"`
	CompressionRatio      string `json:"compressionRatio"`
	SHA256PayloadHash     string `json:"sha256PayloadHash"`
	ECDSASignatureP384    string `json:"ecdsaSignatureP384"`
	KMSKeyARN             string `json:"kmsKeyArn"`
	PagesCount            int    `json:"pagesCount"`
	VisualsCount          int    `json:"visualsCount"`
	TablesCount           int    `json:"tablesCount"`
	MeasuresCount         int    `json:"measuresCount"`
	CompiledAt            string `json:"compiledAt"`
}

func GenerateManifest(capsuleID, dashName, pbixHash, payloadHash, ecdsaSig string, compressedSize, uncompressedSize int64, pages, visuals, tables, measures int) (*CapsuleManifest, []byte, error) {
	ratioPercent := (1.0 - (float64(compressedSize) / float64(uncompressedSize))) * 100.0

	manifest := &CapsuleManifest{
		MagicHeader:           "DCAPSv1",
		SpecVersion:           "1.0.0",
		BIToolAdapter:         "POWER_BI",
		CapsuleID:             capsuleID,
		DashboardName:         dashName,
		PBIXFingerprintSHA256: pbixHash,
		FileSizeBytes:         compressedSize,
		UncompressedSizeBytes: uncompressedSize,
		CompressionRatio:      fmt.Sprintf("-%.1f%%", ratioPercent),
		SHA256PayloadHash:     payloadHash,
		ECDSASignatureP384:    ecdsaSig,
		KMSKeyARN:             "arn:aws:kms:us-east-1:123456789012:key/dcaps-envelope-key",
		PagesCount:            pages,
		VisualsCount:          visuals,
		TablesCount:           tables,
		MeasuresCount:         measures,
		CompiledAt:            time.Now().UTC().Format(time.RFC3339),
	}

	manifestBytes, err := json.MarshalIndent(manifest, "", "  ")
	return manifest, manifestBytes, err
}
