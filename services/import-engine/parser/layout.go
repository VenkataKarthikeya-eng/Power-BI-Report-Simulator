package parser

import (
	"bytes"
	"encoding/json"
	"fmt"
	"unicode/utf16"
)

type LayoutPage struct {
	Name        string         `json:"name"`
	DisplayName string         `json:"displayName"`
	Ordinal     int            `json:"ordinal"`
	Width       float64        `json:"width"`
	Height      float64        `json:"height"`
	Containers  []VisualObject `json:"visualContainers"`
	Filters     []string       `json:"filters,omitempty"`
}

type VisualObject struct {
	ID         string                 `json:"id,omitempty"`
	X          float64                `json:"x"`
	Y          float64                `json:"y"`
	Width      float64                `json:"width"`
	Height     float64                `json:"height"`
	Z          int                    `json:"z"`
	VisualType string                 `json:"visualType,omitempty"`
	Config     map[string]interface{} `json:"config,omitempty"`
}

type ParsedLayout struct {
	Pages     []LayoutPage `json:"sections"`
	Bookmarks []string     `json:"bookmarks,omitempty"`
	Theme     string       `json:"theme,omitempty"`
}

func decodeUTF16LE(b []byte) []byte {
	if len(b)%2 != 0 {
		b = b[:len(b)-1]
	}
	if len(b) >= 2 && b[0] == 0xFF && b[1] == 0xFE {
		b = b[2:]
	}
	u16s := make([]uint16, len(b)/2)
	for i := 0; i < len(u16s); i++ {
		u16s[i] = uint16(b[2*i]) | (uint16(b[2*i+1]) << 8)
	}
	runes := utf16.Decode(u16s)
	var buf bytes.Buffer
	for _, r := range runes {
		buf.WriteRune(r)
	}
	return buf.Bytes()
}

func ParseLayoutAST(layoutBytes []byte) (*ParsedLayout, error) {
	if len(layoutBytes) == 0 {
		return nil, fmt.Errorf("layout bytes empty")
	}

	var rawParsed ParsedLayout
	// Try parsing directly as UTF-8
	err := json.Unmarshal(layoutBytes, &rawParsed)
	if err != nil || len(rawParsed.Pages) == 0 {
		// Attempt UTF-16LE conversion (standard for Power BI Report/Layout streams)
		utf8Bytes := decodeUTF16LE(layoutBytes)
		if err2 := json.Unmarshal(utf8Bytes, &rawParsed); err2 != nil {
			return nil, fmt.Errorf("failed to parse layout AST: %v (utf16 err: %v)", err, err2)
		}
	}

	return &rawParsed, nil
}

