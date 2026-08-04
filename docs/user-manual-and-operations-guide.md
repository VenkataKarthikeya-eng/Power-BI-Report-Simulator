# End-User Manual & Operations Troubleshooting Guide

---

## 1. Power BI Report Ingestion Workflow

1. Log in to the **Dashboard Capsule AI SaaS Workspace** (`http://localhost:3001`).
2. Click **Import PBIX** in the top navigation bar.
3. Drag & drop your Power BI `.pbix` report file into the ingestion zone.
4. The system automatically executes:
   - Archive extraction & UTF-16LE layout parsing.
   - VertiPaq data model parsing.
   - AI Security & DAX validation check.
   - Automated layout grid snapping and package optimization.
5. Click **Compile Capsule** to generate the encrypted `.dcaps` package.

---

## 2. Interactive Viewer Runtime & Controls

When viewing a capsule in the **WASM Viewer** (`http://localhost:3003`):
- **Slicers**: Use top & sidebar dropdowns to filter metrics in real-time.
- **Cross-Filtering**: Click any bar, line data point, or table row to cross-filter all other visuals on the canvas.
- **Bookmarks**: Save custom filter configurations by clicking **Save Bookmark** in the toolbar.
- **AI Copilot**: Click the AI floating button to ask natural language business questions (e.g. *"What caused the Freight Margin decrease in Q3?"*).

---

## 3. Operational Troubleshooting & FAQ

### Issue: PBIX Upload Returns "Invalid ZIP Container"
- **Cause**: The `.pbix` file is corrupted or protected by Microsoft Information Protection (MIP) RMS encryption.
- **Fix**: Re-save the file in Power BI Desktop without RMS file encryption applied, then re-upload.

### Issue: WebAssembly Canvas Memory Error
- **Cause**: Dataset exceeds client browser WASM memory limits (>2GB heap).
- **Fix**: Enable DuckDB WASM disk-backed buffer swapping in Org Settings or apply AI DataModel column pruning optimization.
