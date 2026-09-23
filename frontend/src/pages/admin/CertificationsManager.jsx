import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle2, Loader2, Award, ExternalLink, FileText } from 'lucide-react';
import { certificationsApi } from '../../api/endpoints';
import { FileUploader } from '../../components/admin/FileUploader';
import { ConfirmModal } from '../../components/admin/ConfirmModal';

export const CertificationsManager = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const initialForm = {
    name: '',
    issuingOrg: '',
    issueDate: '',
    credentialId: '',
    credentialUrl: '',
    certificateFileUrl: '',
    displayOrder: 0,
    isActive: true,
  };

  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const loadData = async () => {
    try {
      const data = await certificationsApi.getAll(true);
      setItems(data);
    } catch (err) {
      console.error('Failed to load certifications:', err);
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
      name: item.name,
      issuingOrg: item.issuingOrg,
      issueDate: item.issueDate || '',
      credentialId: item.credentialId || '',
      credentialUrl: item.credentialUrl || '',
      certificateFileUrl: item.certificateFileUrl || '',
      displayOrder: item.displayOrder ?? 0,
      isActive: item.isActive ?? true,
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingItem) {
        await certificationsApi.update(editingItem.id, form);
        setMessage('Certification updated successfully!');
      } else {
        await certificationsApi.create(form);
        setMessage('Certification added successfully!');
      }
      setModalOpen(false);
      loadData();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving certification');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await certificationsApi.delete(deleteTarget.id);
      setDeleteTarget(null);
      setMessage('Certification deleted successfully!');
      loadData();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      alert('Failed to delete certification');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Certifications Management
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage your licenses, course certifications, and badges.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#00a2ff] text-slate-950 hover:bg-[#0091e6] transition-all shadow-lg shadow-sky-500/10 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Certification
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
          <Award className="w-8 h-8 text-slate-500 mx-auto mb-2" />
          <p className="text-sm font-medium text-slate-300">No certifications added yet.</p>
          <p className="text-xs text-slate-500 mt-1">Click "Add Certification" above to add your credentials.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className={`rounded-2xl border p-5 flex flex-col justify-between transition-all ${
                item.isActive
                  ? 'bg-[#0d1322] border-[#1b253b]'
                  : 'bg-[#0a0f1d] border-slate-900 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="text-base font-bold text-white">{item.name}</h3>
                  <Award className="w-5 h-5 text-sky-400 shrink-0" />
                </div>
                <p className="text-sm font-medium text-sky-400 mb-1">{item.issuingOrg}</p>
                <div className="text-xs text-slate-400 space-y-0.5 mb-3">
                  {item.issueDate && <p>Issued: {item.issueDate}</p>}
                  {item.credentialId && <p className="font-mono text-slate-500">ID: {item.credentialId}</p>}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  {item.credentialUrl && (
                    <a
                      href={item.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sky-400 hover:underline flex items-center gap-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Verify
                    </a>
                  )}
                  {item.certificateFileUrl && (
                    <a
                      href={item.certificateFileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-300 hover:underline flex items-center gap-1"
                    >
                      <FileText className="w-3.5 h-3.5" /> File
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title="Edit Certification"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(item)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                    title="Delete Certification"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Certification Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="bg-[#0d1322] border border-[#1b253b] rounded-2xl max-w-xl w-full p-6 text-slate-200 shadow-2xl my-8">
            <h3 className="text-lg font-bold text-white mb-4">
              {editingItem ? 'Edit Certification' : 'Add Certification'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Certificate Name *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. AWS Certified Solutions Architect"
                  required
                  className="w-full rounded-xl bg-[#070913] border border-slate-800 text-sm text-white px-3.5 py-2 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Issuing Organization *
                  </label>
                  <input
                    type="text"
                    value={form.issuingOrg}
                    onChange={(e) => setForm({ ...form, issuingOrg: e.target.value })}
                    placeholder="e.g. Amazon Web Services, Coursera"
                    required
                    className="w-full rounded-xl bg-[#070913] border border-slate-800 text-sm text-white px-3.5 py-2 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Issue Date
                  </label>
                  <input
                    type="text"
                    value={form.issueDate}
                    onChange={(e) => setForm({ ...form, issueDate: e.target.value })}
                    placeholder="e.g. May 2024"
                    className="w-full rounded-xl bg-[#070913] border border-slate-800 text-sm text-white px-3.5 py-2 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Credential ID (Optional)
                  </label>
                  <input
                    type="text"
                    value={form.credentialId}
                    onChange={(e) => setForm({ ...form, credentialId: e.target.value })}
                    placeholder="e.g. ABC-123456"
                    className="w-full rounded-xl bg-[#070913] border border-slate-800 text-sm text-white px-3.5 py-2 focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Credential URL
                  </label>
                  <input
                    type="url"
                    value={form.credentialUrl}
                    onChange={(e) => setForm({ ...form, credentialUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full rounded-xl bg-[#070913] border border-slate-800 text-sm text-white px-3.5 py-2 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <FileUploader
                label="Certificate File / Image (Optional)"
                type="image"
                accept="image/*,.pdf"
                value={form.certificateFileUrl}
                onChange={(url) => setForm({ ...form, certificateFileUrl: url })}
              />

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
                  {saving ? 'Saving...' : editingItem ? 'Update Certification' : 'Save Certification'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Deletion */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Certification"
        message={`Are you sure you want to delete "${deleteTarget?.name}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
