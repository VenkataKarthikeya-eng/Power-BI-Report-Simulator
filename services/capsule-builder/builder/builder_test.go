package builder

import (
	"testing"
)

func TestCompressAndDecompress(t *testing.T) {
	original := []byte("Dashboard Capsule AI — Enterprise WASM Interactive Payload Spec")
	compressed, err := CompressPayload(original)
	if err != nil {
		t.Fatalf("CompressPayload failed: %v", err)
	}

	if len(compressed) == 0 {
		t.Errorf("Expected compressed bytes > 0")
	}

	decompressed, err := DecompressPayload(compressed)
	if err != nil {
		t.Fatalf("DecompressPayload failed: %v", err)
	}

	if string(decompressed) != string(original) {
		t.Errorf("Decompressed content mismatch")
	}
}

func TestSHA256AndSignature(t *testing.T) {
	data := []byte("Test Payload Content for Verification")
	hash := ComputeSHA256(data)
	if len(hash) != 64 {
		t.Errorf("Expected 64-char SHA256 hex string, got %d", len(hash))
	}

	sig, err := SignPayloadECDSA(data)
	if err != nil {
		t.Fatalf("SignPayloadECDSA failed: %v", err)
	}

	if len(sig) == 0 {
		t.Errorf("Expected non-empty ECDSA signature string")
	}
}

func TestCompileCapsuleArchive(t *testing.T) {
	rawAST := []byte(`{"id":"dash_101","pages":[{"displayName":"Q3 Overview"}]}`)
	pkg, archiveBytes, err := CompileCapsuleArchive("Q3_Logistics_Global.pbix", "8f9102ab30", rawAST)
	if err != nil {
		t.Fatalf("CompileCapsuleArchive failed: %v", err)
	}

	if string(pkg.Header) != "DCAPSv1" {
		t.Errorf("Expected DCAPSv1 header")
	}

	if len(archiveBytes) < 7 {
		t.Errorf("Archive bytes too small")
	}
}
