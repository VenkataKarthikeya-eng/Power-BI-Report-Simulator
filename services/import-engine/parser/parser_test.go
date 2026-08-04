package parser

import (
	"archive/zip"
	"bytes"
	"testing"
)

func TestExtractPBIXArchive(t *testing.T) {
	// Create mock ZIP in memory
	buf := new(bytes.Buffer)
	w := zip.NewWriter(buf)

	f, err := w.Create("Report/Layout")
	if err != nil {
		t.Fatalf("Failed to create mock file in ZIP: %v", err)
	}
	f.Write([]byte(`{"sections":[]}`))
	w.Close()

	archive, err := ExtractPBIXArchive(buf.Bytes())
	if err != nil {
		t.Fatalf("ExtractPBIXArchive failed: %v", err)
	}

	if len(archive.LayoutBytes) == 0 {
		t.Errorf("Expected LayoutBytes to be populated")
	}
}

func TestParseLayoutAST(t *testing.T) {
	mockLayoutJSON := []byte(`{"sections":[{"name":"sec1","displayName":"Overview","ordinal":1,"width":1280,"height":720,"visualContainers":[]}]}`)
	parsed, err := ParseLayoutAST(mockLayoutJSON)
	if err != nil {
		t.Fatalf("ParseLayoutAST failed: %v", err)
	}

	if len(parsed.Pages) == 0 {
		t.Errorf("Expected parsed pages count > 0")
	}
}
