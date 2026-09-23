import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle2, Loader2, GraduationCap, Calendar } from 'lucide-react';
import { educationApi } from '../../api/endpoints';
import { ConfirmModal } from '../../components/admin/ConfirmModal';

export const EducationManager = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const initialForm = {
    institution: '',
    degree: '',
    fieldOfStudy: '',
    startYear: '',
    endYear: '',
    grade: '',
    description: '',
    displayOrder: 0,
  };

  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const loadData = async () => {
    try {
      const data = await educationApi.getAll();
      setItems(data);
    } catch (err) {
      console.error('Failed to load education:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setForm({ ...initialForm, displayOrder: items.length });
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setForm({
      institution: item.institution,
      degree: item.degree,
      fieldOfStudy: item.fieldOfStudy || '',
      startYear: item.startYear || '',
      endYear: item.endYear || '',
      grade: item.grade || '',
      description: item.description || '',
      displayOrder: item.displayOrder ?? 0,
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingItem) {
        await educationApi.update(editingItem.id, form);
        setMessage('Education record updated!');
      } else {
        await educationApi.create(form);
        setMessage('Education record added!');
      }
      setModalOpen(false);
      loadData();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving education record');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await educationApi.delete(deleteTarget.id);
      setDeleteTarget(null);
      setMessage('Education record deleted!');
      loadData();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      alert('Failed to delete education record');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Education Management
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage your degrees, university, grades, and academic achievements.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#00a2ff] text-slate-950 hover:bg-[#0091e6] transition-all shadow-lg shadow-sky-500/10 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Education
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
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-800 p-8 text-center bg-[#0d1322]/40">
          <GraduationCap className="w-8 h-8 text-slate-500 mx-auto mb-2" />
          <p className="text-sm font-medium text-slate-300">No education records added yet.</p>
          <p className="text-xs text-slate-500 mt-1">Click "Add Education" above to enter your academic background.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl bg-[#0d1322] border border-[#1b253b] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
            >
              <div>
                <h3 className="text-base font-bold text-white mb-1">
                  {item.degree} {item.fieldOfStudy ? `in ${item.fieldOfStudy}` : ''}
                </h3>
                <p className="text-sm font-medium text-sky-400 mb-1">{item.institution}</p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                  {(item.startYear || item.endYear) && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> {item.startYear} &ndash; {item.endYear || 'Present'}
                    </span>
                  )}
                  {item.grade && <span>&bull; Grade: {item.grade}</span>}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => openEditModal(item)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Edit Education"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteTarget(item)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                  title="Delete Education"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Education Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="bg-[#0d1322] border border-[#1b253b] rounded-2xl max-w-xl w-full p-6 text-slate-200 shadow-2xl my-8">
            <h3 className="text-lg font-bold text-white mb-4">
              {editingItem ? 'Edit Education' : 'Add Education'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Institution / University *
                </label>
                <input
                  type="text"
                  value={form.institution}
                  onChange={(e) => setForm({ ...form, institution: e.target.value })}
                  placeholder="e.g. Stanford University / Parul University"
                  required
                  className="w-full rounded-xl bg-[#070913] border border-slate-800 text-sm text-white px-3.5 py-2 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Degree *
                  </label>
                  <input
                    type="text"
                    value={form.degree}
                    onChange={(e) => setForm({ ...form, degree: e.target.value })}
                    placeholder="e.g. Bachelor of Technology (B.Tech)"
                    required
                    className="w-full rounded-xl bg-[#070913] border border-slate-800 text-sm text-white px-3.5 py-2 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Field of Study
                  </label>
                  <input
                    type="text"
                    value={form.fieldOfStudy}
                    onChange={(e) => setForm({ ...form, fieldOfStudy: e.target.value })}
                    placeholder="e.g. Computer Science and Engineering"
                    className="w-full rounded-xl bg-[#070913] border border-slate-800 text-sm text-white px-3.5 py-2 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Start Year
                  </label>
                  <input
                    type="text"
                    value={form.startYear}
                    onChange={(e) => setForm({ ...form, startYear: e.target.value })}
                    placeholder="e.g. 2023"
                    className="w-full rounded-xl bg-[#070913] border border-slate-800 text-sm text-white px-3.5 py-2 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    End Year / Batch
                  </label>
                  <input
                    type="text"
                    value={form.endYear}
                    onChange={(e) => setForm({ ...form, endYear: e.target.value })}
                    placeholder="e.g. 2027"
                    className="w-full rounded-xl bg-[#070913] border border-slate-800 text-sm text-white px-3.5 py-2 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Grade / CGPA
                  </label>
                  <input
                    type="text"
                    value={form.grade}
                    onChange={(e) => setForm({ ...form, grade: e.target.value })}
                    placeholder="e.g. 8.9 / 10"
                    className="w-full rounded-xl bg-[#070913] border border-slate-800 text-sm text-white px-3.5 py-2 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Description / Relevant Coursework
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  placeholder="Data Structures, Algorithms, DBMS, Operating Systems..."
                  className="w-full rounded-xl bg-[#070913] border border-slate-800 text-sm text-white px-3.5 py-2 focus:outline-none focus:border-sky-500"
                />
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
                  {saving ? 'Saving...' : editingItem ? 'Update Education' : 'Save Education'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Deletion */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Education"
        message={`Are you sure you want to delete ${deleteTarget?.degree} from ${deleteTarget?.institution}?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
