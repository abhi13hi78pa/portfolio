import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle2, Loader2, Terminal, ExternalLink } from 'lucide-react';
import { codingProfilesApi } from '../../api/endpoints';
import { TechIcon } from '../../components/common/TechIcon';
import { ConfirmModal } from '../../components/admin/ConfirmModal';

export const CodingProfilesManager = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const initialForm = {
    platformName: '',
    username: '',
    url: '',
    icon: '',
    displayOrder: 0,
    isActive: true,
  };

  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const loadProfiles = async () => {
    try {
      const data = await codingProfilesApi.getAll(true);
      setProfiles(data);
    } catch (err) {
      console.error('Error fetching coding profiles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfiles();
  }, []);

  const openAddModal = () => {
    setEditingProfile(null);
    setForm({ ...initialForm, displayOrder: profiles.length });
    setModalOpen(true);
  };

  const openEditModal = (profile) => {
    setEditingProfile(profile);
    setForm({
      platformName: profile.platformName,
      username: profile.username || '',
      url: profile.url,
      icon: profile.icon || '',
      displayOrder: profile.displayOrder ?? 0,
      isActive: profile.isActive ?? true,
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingProfile) {
        await codingProfilesApi.update(editingProfile.id, form);
        setMessage('Coding profile updated successfully!');
      } else {
        await codingProfilesApi.create(form);
        setMessage('Coding profile added successfully!');
      }
      setModalOpen(false);
      loadProfiles();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving coding profile');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await codingProfilesApi.delete(deleteTarget.id);
      setDeleteTarget(null);
      setMessage('Coding profile deleted successfully!');
      loadProfiles();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      alert('Failed to delete coding profile');
    }
  };

  const presets = [
    { name: 'LeetCode', icon: 'leetcode' },
    { name: 'Codeforces', icon: 'codeforces' },
    { name: 'CodeChef', icon: 'codechef' },
    { name: 'HackerRank', icon: 'hackerrank' },
    { name: 'GitHub', icon: 'github' },
    { name: 'Kaggle', icon: 'Terminal' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Coding Profiles Management
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Connect your competitive programming handles (LeetCode, Codeforces, HackerRank, etc.).
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#00a2ff] text-slate-950 hover:bg-[#0091e6] transition-all shadow-lg shadow-sky-500/10 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Profile
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
      ) : profiles.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-800 p-8 text-center bg-[#0d1322]/40">
          <Terminal className="w-8 h-8 text-slate-500 mx-auto mb-2" />
          <p className="text-sm font-medium text-slate-300">No coding profiles added yet.</p>
          <p className="text-xs text-slate-500 mt-1">
            Click "Add Profile" to link your LeetCode, Codeforces, or HackerRank profiles.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {profiles.map((p) => (
            <div
              key={p.id}
              className={`rounded-xl border p-4 flex items-center justify-between transition-all ${
                p.isActive
                  ? 'bg-[#0d1322] border-[#1b253b] hover:border-slate-700'
                  : 'bg-[#0a0f1d] border-slate-900 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-[#141d33] border border-[#1e2a47] flex items-center justify-center shrink-0">
                  <TechIcon name={p.icon || p.platformName} className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <h4 className="text-sm font-semibold text-white truncate">{p.platformName}</h4>
                  {p.username && <p className="text-xs text-slate-400">@{p.username}</p>}
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0 ml-2">
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-sky-400 transition-colors"
                  title="Visit URL"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  onClick={() => openEditModal(p)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Edit Profile"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeleteTarget(p)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                  title="Delete Profile"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Coding Profile Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0d1322] border border-[#1b253b] rounded-2xl max-w-md w-full p-6 text-slate-200 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">
              {editingProfile ? 'Edit Coding Profile' : 'Add Coding Profile'}
            </h3>

            {/* Quick preset selector */}
            {!editingProfile && (
              <div className="mb-4">
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Quick Select Platform
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {presets.map((item) => (
                    <button
                      type="button"
                      key={item.name}
                      onClick={() => setForm({ ...form, platformName: item.name, icon: item.icon })}
                      className="px-2.5 py-1 rounded-lg text-xs bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
                    >
                      {item.name}
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
                  value={form.platformName}
                  onChange={(e) => setForm({ ...form, platformName: e.target.value })}
                  placeholder="e.g. LeetCode, Codeforces"
                  required
                  className="w-full rounded-xl bg-[#070913] border border-slate-800 text-sm text-white px-3.5 py-2 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Handle / Username (Optional)
                </label>
                <input
                  type="text"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  placeholder="e.g. johndoe"
                  className="w-full rounded-xl bg-[#070913] border border-slate-800 text-sm text-white px-3.5 py-2 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Profile URL *
                </label>
                <input
                  type="url"
                  value={form.url}
                  onChange={(e) => setForm({ ...form, url: e.target.value })}
                  placeholder="https://leetcode.com/u/..."
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
                    placeholder="leetcode, codeforces..."
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
                  {saving ? 'Saving...' : editingProfile ? 'Update Profile' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Deletion */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Coding Profile"
        message={`Are you sure you want to delete "${deleteTarget?.platformName}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
