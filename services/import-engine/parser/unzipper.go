package parser

import (
	"archive/zip"
	"bytes"
	"errors"
	"io"
)

type ExtractedPBIXArchive struct {
	LayoutBytes    []byte
	DataModelBytes []byte
	ContentTypes   []byte
}

func ExtractPBIXArchive(pbixBytes []byte) (*ExtractedPBIXArchive, error) {
	reader, err := zip.NewReader(bytes.NewReader(pbixBytes), int64(len(pbixBytes)))
	if err != nil {
		return nil, errors.New("invalid or corrupted PBIX archive: unable to read ZIP container")
	}

	archive := &ExtractedPBIXArchive{}

	for _, file := range reader.File {
		rc, err := file.Open()
		if err != nil {
			continue
		}

		content, err := io.ReadAll(rc)
		rc.Close()
		if err != nil {
			continue
		}

		switch file.Name {
		case "Report/Layout":
			archive.LayoutBytes = content
		case "DataModel":
			archive.DataModelBytes = content
		case "[Content_Types].xml":
			archive.ContentTypes = content
		}
	}

	if len(archive.LayoutBytes) == 0 {
		return nil, errors.New("missing Report/Layout stream inside PBIX container")
	}

	return archive, nil
}
