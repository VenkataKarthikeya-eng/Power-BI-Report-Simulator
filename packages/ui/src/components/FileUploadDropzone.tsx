'use client';

import React, { useState } from 'react';

export interface FileUploadDropzoneProps {
  onFileSelect?: (file: File) => void;
  acceptedFormats?: string[];
  maxSizeMb?: number;
}

export const FileUploadDropzone: React.FC<FileUploadDropzoneProps> = ({
  onFileSelect,
  acceptedFormats = ['.pbix', '.pbit'],
  maxSizeMb = 500,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      if (onFileSelect) onFileSelect(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (onFileSelect) onFileSelect(file);
    }
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all ${
        dragActive
          ? 'border-indigo-500 bg-indigo-950/20 scale-[1.01]'
          : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
      }`}
    >
      <input
        type="file"
        id="file-upload-input"
        accept={acceptedFormats.join(',')}
        onChange={handleChange}
        className="hidden"
      />
      <label htmlFor="file-upload-input" className="cursor-pointer space-y-4 block">
        <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mx-auto text-3xl font-bold">
          📁
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">
            {selectedFile ? selectedFile.name : 'Drag & drop Power BI report here'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {selectedFile
              ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB — Ready for AI Ingestion`
              : `Supports ${acceptedFormats.join(', ')} up to ${maxSizeMb}MB`}
          </p>
        </div>
        <div className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-colors">
          Browse Local Files
        </div>
      </label>
    </div>
  );
};
