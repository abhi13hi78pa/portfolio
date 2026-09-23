import React, { useState, useEffect } from 'react';
import { Save, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { profileApi } from '../../api/endpoints';

export const AboutManager = () => {
  const [formData, setFormData] = useState({
    aboutHeading: 'About',
    aboutDescription: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await profileApi.getProfile();
        setFormData({
          aboutHeading: data.aboutHeading || 'About',
          aboutDescription: data.aboutDescription || '',
        });
      } catch (err) {
        console.error('Failed to load about data:', err);
        setErrorMsg('Failed to load about section data.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      await profileApi.updateProfile(formData);
      setSuccessMsg('About section updated successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error('Error saving about section:', err);
      setErrorMsg(err.response?.data?.message || 'Failed to update about section.');
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
            About Section Management
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Write your personal bio, engineering journey, and interests.
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

      <form onSubmit={handleSubmit} className="rounded-2xl bg-[#0d1322] border border-[#1b253b] p-6 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Section Heading
          </label>
          <input
            type="text"
            value={formData.aboutHeading}
            onChange={(e) => setFormData((prev) => ({ ...prev, aboutHeading: e.target.value }))}
            placeholder="About"
            required
            className="w-full rounded-xl bg-[#070913] border border-slate-800 text-sm text-white px-3.5 py-2.5 focus:outline-none focus:border-sky-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            About Description
          </label>
          <textarea
            value={formData.aboutDescription}
            onChange={(e) => setFormData((prev) => ({ ...prev, aboutDescription: e.target.value }))}
            rows={8}
            placeholder="Add your background, engineering interests, and education story here..."
            className="w-full rounded-xl bg-[#070913] border border-slate-800 text-sm text-white px-3.5 py-2.5 focus:outline-none focus:border-sky-500 leading-relaxed font-normal"
          />
          <p className="text-[11px] text-slate-500 mt-1">
            Line breaks are preserved on the public site.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-[#00a2ff] text-slate-950 hover:bg-[#0091e6] active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-sky-500/10"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> Save About Content
            </>
          )}
        </button>
      </form>
    </div>
  );
};
