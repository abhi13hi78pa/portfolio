import React, { useState, useEffect } from 'react';
import { Save, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { profileApi } from '../../api/endpoints';
import { FileUploader } from '../../components/admin/FileUploader';

export const ProfileHeroPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    tagline: '',
    heroDescription: '',
    aboutHeading: '',
    aboutDescription: '',
    profileImageUrl: '',
    resumeUrl: '',
    primaryBtnText: 'Download Resume',
    secondaryBtnText: 'View Projects',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await profileApi.getProfile();
        setFormData({
          name: data.name || '',
          role: data.role || '',
          tagline: data.tagline || '',
          heroDescription: data.heroDescription || '',
          aboutHeading: data.aboutHeading || 'About',
          aboutDescription: data.aboutDescription || '',
          profileImageUrl: data.profileImageUrl || '',
          resumeUrl: data.resumeUrl || '',
          primaryBtnText: data.primaryBtnText || 'Download Resume',
          secondaryBtnText: data.secondaryBtnText || 'View Projects',
        });
      } catch (err) {
        console.error('Error fetching profile:', err);
        setErrorMsg('Failed to load profile data.');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      await profileApi.updateProfile(formData);
      setSuccessMsg('Profile and Hero information saved successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error('Save error:', err);
      setErrorMsg(err.response?.data?.message || 'Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-12 flex justify-center text-slate-400">
        <Loader2 className="w-6 h-6 animate-spin text-sky-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl animate-in fade-in">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Profile & Hero Management
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Update your public personal name, role badge, tagline, and call-to-actions.
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-900/60 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="rounded-2xl bg-[#0d1322] border border-[#1b253b] p-6 space-y-4">
          <h3 className="text-base font-bold text-white mb-2">Hero Section</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. John Doe"
                required
                className="w-full rounded-xl bg-[#070913] border border-slate-800 text-sm text-white px-3.5 py-2.5 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Role / Title Badge
              </label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="e.g. Full-Stack Software Engineer"
                required
                className="w-full rounded-xl bg-[#070913] border border-slate-800 text-sm text-white px-3.5 py-2.5 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Professional Tagline / Short Intro
            </label>
            <textarea
              name="tagline"
              value={formData.tagline}
              onChange={handleChange}
              rows={3}
              placeholder="e.g. Computer Science student passionate about scalable systems..."
              className="w-full rounded-xl bg-[#070913] border border-slate-800 text-sm text-white px-3.5 py-2.5 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Primary Button Label
              </label>
              <input
                type="text"
                name="primaryBtnText"
                value={formData.primaryBtnText}
                onChange={handleChange}
                placeholder="Download Resume"
                className="w-full rounded-xl bg-[#070913] border border-slate-800 text-sm text-white px-3.5 py-2.5 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Secondary Button Label
              </label>
              <input
                type="text"
                name="secondaryBtnText"
                value={formData.secondaryBtnText}
                onChange={handleChange}
                placeholder="View Projects"
                className="w-full rounded-xl bg-[#070913] border border-slate-800 text-sm text-white px-3.5 py-2.5 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>
        </div>

        {/* Media / Files */}
        <div className="rounded-2xl bg-[#0d1322] border border-[#1b253b] p-6 space-y-4">
          <h3 className="text-base font-bold text-white mb-2">Resume & Assets</h3>

          <FileUploader
            label="Upload Resume (PDF/DOC)"
            type="resume"
            accept=".pdf,.doc,.docx"
            value={formData.resumeUrl}
            onChange={(url) => setFormData((prev) => ({ ...prev, resumeUrl: url }))}
            helperText="The 'Download Resume' buttons on the public site will immediately link to this uploaded file."
          />

          <FileUploader
            label="Profile Image (Optional)"
            type="image"
            accept="image/*"
            value={formData.profileImageUrl}
            onChange={(url) => setFormData((prev) => ({ ...prev, profileImageUrl: url }))}
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-[#00a2ff] text-slate-950 hover:bg-[#0091e6] active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-sky-500/10"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Saving Changes...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> Save Profile & Hero
            </>
          )}
        </button>
      </form>
    </div>
  );
};
