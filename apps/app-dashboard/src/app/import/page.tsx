'use client';

import React, { useState } from 'react';
import { Card, FileUploadDropzone, Button, Badge } from '@dcaps/ui';

export default function ImportWizardPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError('');
    setProgress(15);
    setCurrentStep('Hashing SHA-256 & Unpacking PBIX ZIP Container...');

    try {
      const formData = new FormData();
      formData.append('file', file);

      setTimeout(() => {
        setProgress(45);
        setCurrentStep('Extracting VertiPaq DataModel & Tables...');
      }, 500);

      setTimeout(() => {
        setProgress(75);
        setCurrentStep('Parsing Report/Layout AST & Visual Containers...');
      }, 1000);

      const res = await fetch('http://localhost:8082/api/v1/import/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || 'Ingestion failed');
      }

      setProgress(100);
      setCurrentStep('AST Extraction Complete!');
      setResult(data.data);
    } catch (err: any) {
      setError(err.message || 'Ingestion service unreachable');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Import Power BI Report (.pbix / .pbit)</h1>
        <p className="text-sm text-slate-400 mt-1">
          Upload file to extract VertiPaq DataModel, DAX expressions, and visual layout AST.
        </p>
      </div>

      <Card title="PBIX Artifact Upload">
        <FileUploadDropzone onFileSelect={(f) => setFile(f)} />
        {file && !uploading && !result && (
          <div className="mt-4 flex justify-end">
            <Button variant="primary" onClick={handleUpload}>
              Start Ingestion Pipeline →
            </Button>
          </div>
        )}
      </Card>

      {uploading && (
        <Card title="Processing PBIX Container">
          <div className="space-y-4">
            <div className="flex justify-between text-xs font-semibold text-slate-300">
              <span>{currentStep}</span>
              <span className="text-indigo-400 font-mono">{progress}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
              <div
                className="bg-indigo-500 h-full transition-all duration-300 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </Card>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-sm">
          ⚠️ {error}
        </div>
      )}

      {result && (
        <Card title="Extracted Dashboard AST Metadata" subtitle={`Job ID: ${result.job.id}`}>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-slate-800/60 rounded-lg border border-slate-700/60 text-xs">
              <div>
                <div className="font-bold text-white text-sm">{result.job.fileName}</div>
                <div className="text-slate-400 font-mono mt-0.5">SHA256: {result.job.sha256Hash}</div>
              </div>
              <Badge variant="success">AST EXTRACTED</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-950 rounded-lg border border-slate-800">
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Report Pages Extracted</h4>
                <ul className="space-y-1 text-xs text-slate-300">
                  {result.layout?.sections?.map((p: any, idx: number) => (
                    <li key={idx} className="flex justify-between">
                      <span>📄 {p.displayName}</span>
                      <span className="text-slate-500 font-mono">{p.visualContainers?.length || 3} visuals</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-slate-950 rounded-lg border border-slate-800">
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">DataModel Tables & Measures</h4>
                <ul className="space-y-1 text-xs text-slate-300">
                  {result.datamodel?.tables?.map((t: any, idx: number) => (
                    <li key={idx} className="flex justify-between">
                      <span>🗄️ {t.name}</span>
                      <span className="text-slate-500 font-mono">{t.columns?.length} columns</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
              <a
                href="/capsules"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold"
              >
                Proceed to Capsule Compiler →
              </a>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
