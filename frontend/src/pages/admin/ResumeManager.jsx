import React, { useState, useEffect } from 'react';
import { FileText, Download, Trash2, CheckCircle2, AlertCircle, Loader2, ExternalLink } from 'lucide-react';
import { profileApi } from '../../api/endpoints';
import { FileUploader } from '../../components/admin/FileUploader';
import { ConfirmModal } from '../../components/admin/ConfirmModal';

export const ResumeManager = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  const loadProfile = async () => {
    try {
      const data = await profileApi.getProfile();
      setProfile(data);
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleUploadResume = async (url) => {
    setSaving(true);
    try {
      await profileApi.updateProfile({ resumeUrl: url });
      setProfile((prev) => ({ ...prev, resumeUrl: url }));
      setMessage(url ? 'Resume uploaded successfully!' : 'Resume removed successfully!');
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      alert('Failed to update resume');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteResume = async () => {
    setConfirmDelete(false);
    await handleUploadResume('');
  };

  if (loading) {
    return (
      <div className="py-12 flex justify-center text-slate-400">
        <Loader2 className="w-6 h-6 animate-spin text-sky-400" />
      </div>
    );
  }

  const hasResume = Boolean(profile?.resumeUrl);

  return (
    <div className="space-y-6 max-w-2xl animate-in fade-in">
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Resume Management
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Upload, replace, preview, or remove your resume PDF/DOC document.
        </p>
      </div>

      {message && (
        <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Current Resume Status Card */}
      <div className="rounded-2xl bg-[#0d1322] border border-[#1b253b] p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              hasResume ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30' : 'bg-slate-900 text-slate-600 border border-slate-800'
            }`}>
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Current Active Resume</h3>
              <p className="text-xs text-slate-400">
                {hasResume ? 'Your latest resume is active on the public portfolio.' : 'No resume uploaded yet.'}
              </p>
            </div>
          </div>

          {hasResume && (
            <div className="flex items-center gap-2">
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#00a2ff] text-slate-950 hover:bg-[#0091e6] transition-all"
              >
                <Download className="w-3.5 h-3.5" /> Download
              </a>
              <button
                onClick={() => setConfirmDelete(true)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-900 transition-colors"
                title="Delete Resume"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {hasResume && (
          <div className="pt-3 border-t border-slate-800 text-xs text-slate-400 space-y-1">
            <p className="text-slate-500 truncate">URL: {profile.resumeUrl}</p>
            <p className="text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Public "Download Resume" buttons are actively linked to this file.
            </p>
          </div>
        )}
      </div>

      {/* Upload / Replace Area */}
      <div className="rounded-2xl bg-[#0d1322] border border-[#1b253b] p-6 space-y-4">
        <h3 className="text-base font-bold text-white">
          {hasResume ? 'Replace Resume' : 'Upload New Resume'}
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          Upload your resume in PDF or DOC format. When you upload a new document, it will immediately replace the active version on your portfolio.
        </p>

        <FileUploader
          label="Choose Resume Document"
          type="resume"
          accept=".pdf,.doc,.docx"
          value=""
          onChange={handleUploadResume}
        />
      </div>

      {/* Confirm Deletion */}
      <ConfirmModal
        isOpen={confirmDelete}
        title="Delete Resume"
        message="Are you sure you want to remove the current resume? The public 'Download Resume' buttons will be disabled until a new one is uploaded."
        onConfirm={handleDeleteResume}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  );
};
