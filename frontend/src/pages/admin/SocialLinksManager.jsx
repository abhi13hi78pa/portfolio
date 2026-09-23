import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle2, Loader2, Share2, ExternalLink } from 'lucide-react';
import { socialLinksApi } from '../../api/endpoints';
import { TechIcon } from '../../components/common/TechIcon';
import { ConfirmModal } from '../../components/admin/ConfirmModal';

export const SocialLinksManager = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const initialForm = {
    platform: '',
    urlOrValue: '',
    icon: '',
    displayOrder: 0,
    isActive: true,
  };

  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const loadLinks = async () => {
    try {
      const data = await socialLinksApi.getAll(true);
      setLinks(data);
    } catch (err) {
      console.error('Failed to load social links:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLinks();
  }, []);

  const openAddModal = () => {
    setEditingLink(null);
    setForm({ ...initialForm, displayOrder: links.length });
    setModalOpen(true);
  };

  const openEditModal = (link) => {
    setEditingLink(link);
    setForm({
      platform: link.platform,
      urlOrValue: link.urlOrValue,
      icon: link.icon || '',
      displayOrder: link.displayOrder ?? 0,
      isActive: link.isActive ?? true,
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingLink) {
        await socialLinksApi.update(editingLink.id, form);
        setMessage('Contact link updated!');
      } else {
        await socialLinksApi.create(form);
        setMessage('Contact link added!');
      }
      setModalOpen(false);
      loadLinks();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving contact link');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await socialLinksApi.delete(deleteTarget.id);
      setDeleteTarget(null);
      setMessage('Contact link deleted!');
      loadLinks();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      alert('Failed to delete contact link');
    }
  };

  const presets = [
    { platform: 'LinkedIn', icon: 'linkedin', placeholder: 'https://linkedin.com/in/username' },
    { platform: 'GitHub', icon: 'github', placeholder: 'https://github.com/username' },
    { platform: 'Email', icon: 'mail', placeholder: 'your.email@example.com' },
    { platform: 'Twitter / X', icon: 'twitter', placeholder: 'https://x.com/username' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Social & Contact Links
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage your LinkedIn, GitHub, Email, and social contacts displayed under "Let's Connect" and the Footer.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#00a2ff] text-slate-950 hover:bg-[#0091e6] transition-all shadow-lg shadow-sky-500/10 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Link
        </button>
      </div>

      {message && (
        <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {loading ? (
        <div className="py-12 flex justify-center text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin text-sky-400" />
        </div>
      ) : links.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-800 p-8 text-center bg-[#0d1322]/40">
          <Share2 className="w-8 h-8 text-slate-500 mx-auto mb-2" />
          <p className="text-sm font-medium text-slate-300">No contact links added yet.</p>
          <p className="text-xs text-slate-500 mt-1">Click "Add Link" to add your LinkedIn, GitHub, or Email.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {links.map((link) => (
            <div
              key={link.id}
              className={`rounded-xl border p-4 flex items-center justify-between transition-all ${
                link.isActive
                  ? 'bg-[#0d1322] border-[#1b253b]'
                  : 'bg-[#0a0f1d] border-slate-900 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-[#141d33] border border-[#1e2a47] flex items-center justify-center shrink-0">
                  <TechIcon name={link.icon || link.platform} className="w-5 h-5 text-sky-400" />
                </div>
                <div className="truncate">
                  <h4 className="text-sm font-semibold text-white">{link.platform}</h4>
                  <p className="text-xs text-slate-400 truncate max-w-xs">{link.urlOrValue}</p>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0 ml-2">
                <button
                  onClick={() => openEditModal(link)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Edit Link"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeleteTarget(link)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                  title="Delete Link"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0d1322] border border-[#1b253b] rounded-2xl max-w-md w-full p-6 text-slate-200 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">
              {editingLink ? 'Edit Contact Link' : 'Add Contact Link'}
            </h3>

            {!editingLink && (
              <div className="mb-4">
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Quick Presets
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {presets.map((item) => (
                    <button
                      type="button"
                      key={item.platform}
                      onClick={() => setForm({ ...form, platform: item.platform, icon: item.icon })}
                      className="px-2.5 py-1 rounded-lg text-xs bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
                    >
                      {item.platform}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Platform Name *
                </label>
                <input
                  type="text"
                  value={form.platform}
                  onChange={(e) => setForm({ ...form, platform: e.target.value })}
                  placeholder="e.g. LinkedIn, GitHub, Email"
                  required
                  className="w-full rounded-xl bg-[#070913] border border-slate-800 text-sm text-white px-3.5 py-2 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  URL or Email Address *
                </label>
                <input
                  type="text"
                  value={form.urlOrValue}
                  onChange={(e) => setForm({ ...form, urlOrValue: e.target.value })}
                  placeholder="e.g. https://linkedin.com/in/... or user@example.com"
                  required
                  className="w-full rounded-xl bg-[#070913] border border-slate-800 text-sm text-white px-3.5 py-2 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Icon Identifier
                  </label>
                  <input
                    type="text"
                    value={form.icon}
                    onChange={(e) => setForm({ ...form, icon: e.target.value })}
                    placeholder="linkedin, github, mail..."
                    className="w-full rounded-xl bg-[#070913] border border-slate-800 text-sm text-white px-3.5 py-2 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-300">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                      className="rounded border-slate-800 text-sky-500 focus:ring-0 w-4 h-4 bg-slate-900"
                    />
                    <span>Active / Visible</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 border border-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#00a2ff] text-slate-950 hover:bg-[#0091e6] disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingLink ? 'Update Link' : 'Save Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Deletion */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Contact Link"
        message={`Are you sure you want to delete "${deleteTarget?.platform}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
