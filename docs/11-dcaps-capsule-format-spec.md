# Deliverable 11: Dashboard Capsule (.dcaps) Binary Format & Compiler Specification

## 1. Binary Container Layout

The **Dashboard Capsule (`.dcaps`)** file is a portable, cryptographically signed, encrypted binary archive.

```
[ .dcaps Binary Container Stream ]
├── Offset 0x000 - 0x006 : Magic Header ("DCAPSv1")
├── Offset 0x007 - 0x01F : Manifest Header (JSON/Protobuf Metadata)
├── Offset 0x020 - End   : AES-256-GCM Encrypted & Gzip Compressed Payload
│   ├── ast/dashboard.ast.json      # Optimized Dashboard AST
│   ├── datamodel/duckdb.parquet    # Columnar VertiPaq Data Slices
│   ├── layout/visual_tree.json     # Visual Coordinates & 8pt Grid Config
│   └── assets/                     # Embedded Fonts, Logos, Icons
└── Tail Signature: ECDSA P-384 Digital Signature String
```

---

## 2. Manifest Schema (`manifest.json`)

```json
{
  "magicHeader": "DCAPSv1",
  "specVersion": "1.0.0",
  "biToolAdapter": "POWER_BI",
  "capsuleId": "caps_8f9102ab30c9",
  "dashboardName": "Q3_Logistics_Global.dcaps",
  "pbixFingerprintSha256": "8f9102ab30c92019a82019a82019a820",
  "fileSizeBytes": 18454937,
  "uncompressedSizeBytes": 44040192,
  "compressionRatio": "-58.1%",
  "sha256PayloadHash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "ecdsaSignatureP384": "30460221008f9102ab30c92019a82019a82019a820190221003c91a02b1111482a",
  "kmsKeyArn": "arn:aws:kms:us-east-1:123456789012:key/dcaps-envelope-key",
  "pagesCount": 2,
  "visualsCount": 4,
  "tablesCount": 3,
  "measuresCount": 2,
  "compiledAt": "2026-08-03T04:32:00Z"
}
```

---

## 3. Cryptography & Tamper Prevention

1. **Gzip Binary Compression**: Compresses AST nodes and DuckDB parquet tables by $>50\%$.
2. **AES-256-GCM Envelope Encryption**: Protects proprietary data models against unauthorized extraction.
3. **ECDSA P-384 Hardware Signature**: Signed via AWS KMS HSM to guarantee zero-tampering and verify authenticity prior to client WASM execution.
