import React, { useState } from 'react';
import { UploadCloud, CheckCircle2, AlertCircle, X, Loader2 } from 'lucide-react';
import { uploadApi } from '../../api/endpoints';

export const FileUploader = ({
  label = 'Upload File',
  accept = 'image/*',
  value,
  onChange,
  type = 'image', // 'image' | 'resume'
  helperText,
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      let data;
      if (type === 'resume') {
        data = await uploadApi.uploadResume(file);
      } else {
        data = await uploadApi.uploadImage(file);
      }
      onChange(data.url);
    } catch (err) {
      console.error('Upload failed:', err);
      setError(err.response?.data?.message || 'Upload failed. Please check file format and size.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onChange('');
  };

  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
        {label}
      </label>

      {value ? (
        <div className="relative rounded-xl border border-slate-800 bg-[#070913] p-3 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            {type === 'image' ? (
              <img
                src={value}
                alt="Uploaded preview"
                className="w-12 h-12 object-cover rounded-lg border border-slate-800"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-sky-950/60 border border-sky-800/40 flex items-center justify-center text-sky-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            )}
            <div className="truncate text-xs">
              <span className="text-slate-300 font-medium block truncate max-w-xs">{value}</span>
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-400 hover:underline inline-block mt-0.5"
              >
                View uploaded asset
              </a>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-900 rounded-lg transition-colors"
            title="Remove file"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <label className="border-2 border-dashed border-slate-800 hover:border-sky-500/60 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-[#070913]/50">
          <input
            type="file"
            accept={accept}
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
          {uploading ? (
            <div className="flex items-center gap-2 text-sky-400 text-xs py-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Uploading to server...
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1.5 py-1">
              <UploadCloud className="w-6 h-6 text-slate-500" />
              <p className="text-xs font-medium text-slate-300">
                Click to upload {type === 'resume' ? 'resume (PDF/DOC)' : 'image (PNG, JPG, WebP)'}
              </p>
              <p className="text-[10px] text-slate-500">Max size 10MB</p>
            </div>
          )}
        </label>
      )}

      {error && (
        <p className="text-xs text-rose-400 flex items-center gap-1 mt-1">
          <AlertCircle className="w-3.5 h-3.5" /> {error}
        </p>
      )}

      {helperText && !error && (
        <p className="text-[11px] text-slate-500 mt-1">{helperText}</p>
      )}
    </div>
  );
};
