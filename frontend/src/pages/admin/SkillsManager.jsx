import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle2, AlertCircle, Loader2, Sparkles, MoveUp, MoveDown } from 'lucide-react';
import { skillsApi } from '../../api/endpoints';
import { TechIcon } from '../../components/common/TechIcon';
import { ConfirmModal } from '../../components/admin/ConfirmModal';

export const SkillsManager = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [form, setForm] = useState({
    name: '',
    icon: '',
    category: 'Backend',
    proficiency: '',
    displayOrder: 0,
    isActive: true,
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const loadSkills = async () => {
    try {
      const data = await skillsApi.getAll(true);
      setSkills(data);
    } catch (err) {
      console.error('Error fetching skills:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const openAddModal = () => {
    setEditingSkill(null);
    setForm({
      name: '',
      icon: '',
      category: 'Backend',
      proficiency: '',
      displayOrder: skills.length,
      isActive: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (skill) => {
    setEditingSkill(skill);
    setForm({
      name: skill.name,
      icon: skill.icon || '',
      category: skill.category || 'General',
      proficiency: skill.proficiency || '',
      displayOrder: skill.displayOrder,
      isActive: skill.isActive,
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingSkill) {
        await skillsApi.update(editingSkill.id, form);
        setMessage('Skill updated successfully!');
      } else {
        await skillsApi.create(form);
        setMessage('Skill added successfully!');
      }
      setModalOpen(false);
      loadSkills();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving skill');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await skillsApi.delete(deleteTarget.id);
      setDeleteTarget(null);
      setMessage('Skill deleted successfully!');
      loadSkills();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      alert('Failed to delete skill');
    }
  };

  const handleToggleActive = async (skill) => {
    try {
      await skillsApi.update(skill.id, { isActive: !skill.isActive });
      loadSkills();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const iconPresets = [
    'Python', 'Cpp', 'Java', 'Flask', 'PostgreSQL', 'Docker', 'Git', 'Linux',
    'React', 'Node.js', 'MySQL', 'MongoDB', 'Redis', 'AWS', 'TypeScript', 'JavaScript'
  ];

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Skills Management
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Add, reorder, categorize, or toggle technologies and skills.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#00a2ff] text-slate-950 hover:bg-[#0091e6] transition-all shadow-lg shadow-sky-500/10"
        >
          <Plus className="w-4 h-4" /> Add Skill
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
      ) : skills.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-800 p-8 text-center bg-[#0d1322]/40">
          <Sparkles className="w-8 h-8 text-slate-500 mx-auto mb-2" />
          <p className="text-sm font-medium text-slate-300">No skills added yet.</p>
          <p className="text-xs text-slate-500 mt-1">Click "Add Skill" above to create your first skill.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className={`rounded-xl border p-4 flex items-center justify-between transition-all ${
                skill.isActive
                  ? 'bg-[#0d1322] border-[#1b253b] hover:border-slate-700'
                  : 'bg-[#0a0f1d] border-slate-900 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-[#141d33] border border-[#1e2a47] flex items-center justify-center shrink-0">
                  <TechIcon name={skill.icon || skill.name} className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <h4 className="text-sm font-semibold text-white truncate">{skill.name}</h4>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span>{skill.category}</span>
                    {skill.proficiency && <span>&bull; {skill.proficiency}</span>}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0 ml-2">
                <button
                  onClick={() => handleToggleActive(skill)}
                  title={skill.isActive ? 'Active (Click to hide)' : 'Hidden (Click to enable)'}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    skill.isActive
                      ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {skill.isActive ? 'Active' : 'Off'}
                </button>
                <button
                  onClick={() => openEditModal(skill)}
                  title="Edit Skill"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeleteTarget(skill)}
                  title="Delete Skill"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
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
              {editingSkill ? 'Edit Skill' : 'Add New Skill'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Skill Name *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Python, Docker, C++"
                  required
                  className="w-full rounded-xl bg-[#070913] border border-slate-800 text-sm text-white px-3.5 py-2 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Icon Identifier / Preset
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={form.icon}
                    onChange={(e) => setForm({ ...form, icon: e.target.value })}
                    placeholder="e.g. python, cpp, docker, or icon name"
                    className="flex-1 rounded-xl bg-[#070913] border border-slate-800 text-sm text-white px-3.5 py-2 focus:outline-none focus:border-sky-500"
                  />
                  <div className="w-9 h-9 rounded-xl bg-[#070913] border border-slate-800 flex items-center justify-center">
                    <TechIcon name={form.icon || form.name} className="w-5 h-5" />
                  </div>
                </div>
                {/* Preset badges */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {iconPresets.slice(0, 8).map((preset) => (
                    <button
                      type="button"
                      key={preset}
                      onClick={() => setForm({ ...form, icon: preset })}
                      className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    placeholder="Languages, Backend..."
                    className="w-full rounded-xl bg-[#070913] border border-slate-800 text-sm text-white px-3.5 py-2 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Proficiency (Optional)
                  </label>
                  <input
                    type="text"
                    value={form.proficiency}
                    onChange={(e) => setForm({ ...form, proficiency: e.target.value })}
                    placeholder="e.g. Advanced / 90%"
                    className="w-full rounded-xl bg-[#070913] border border-slate-800 text-sm text-white px-3.5 py-2 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={form.displayOrder}
                    onChange={(e) => setForm({ ...form, displayOrder: parseInt(e.target.value) || 0 })}
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
                  {saving ? 'Saving...' : editingSkill ? 'Update Skill' : 'Create Skill'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Deletion */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Skill"
        message={`Are you sure you want to delete "${deleteTarget?.name}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
