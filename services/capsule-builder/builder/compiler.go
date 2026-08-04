package builder

import (
	"bytes"
	"crypto/rand"
	"fmt"
)

type CapsulePackage struct {
	Header    []byte
	Manifest  *CapsuleManifest
	Payload   []byte
	Signature string
}

func CompileCapsuleArchive(dashName, pbixHash string, rawASTBytes []byte) (*CapsulePackage, []byte, error) {
	uncompressedSize := int64(len(rawASTBytes))

	// 1. Binary Gzip Compression
	compressedBytes, err := CompressPayload(rawASTBytes)
	if err != nil {
		return nil, nil, fmt.Errorf("compression failed: %v", err)
	}

	compressedSize := int64(len(compressedBytes))

	// 2. Encryption (AES-256-GCM Ephemeral Key)
	dekKey := make([]byte, 32)
	if _, err := rand.Read(dekKey); err != nil {
		return nil, nil, fmt.Errorf("failed to generate secure AES key: %v", err)
	}

	encryptedBytes, err := EncryptAESGCM(compressedBytes, dekKey)
	if err != nil {
		return nil, nil, fmt.Errorf("encryption failed: %v", err)
	}

	// 3. Payload Hashing & ECDSA Digital Signature
	payloadHash := ComputeSHA256(encryptedBytes)
	ecdsaSig, err := SignPayloadECDSA(encryptedBytes)
	if err != nil {
		return nil, nil, fmt.Errorf("signature failed: %v", err)
	}

	capsuleID := fmt.Sprintf("caps_%s", payloadHash[:12])

	// 4. Manifest Generation
	manifest, _, err := GenerateManifest(capsuleID, dashName, pbixHash, payloadHash, ecdsaSig, compressedSize, uncompressedSize, 2, 4, 3, 2)
	if err != nil {
		return nil, nil, fmt.Errorf("manifest generation failed: %v", err)
	}

	// 5. Binary Archive Assembly (Magic Header "DCAPSv1" + Encrypted Payload)
	var finalArchive bytes.Buffer
	finalArchive.WriteString("DCAPSv1")
	finalArchive.Write(encryptedBytes)

	pkg := &CapsulePackage{
		Header:    []byte("DCAPSv1"),
		Manifest:  manifest,
		Payload:   encryptedBytes,
		Signature: ecdsaSig,
	}

	return pkg, finalArchive.Bytes(), nil
}
