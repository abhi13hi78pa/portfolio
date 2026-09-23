import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FolderGit2,
  Star,
  Eye,
  EyeOff,
  Github,
  ExternalLink,
} from 'lucide-react';
import { projectsApi } from '../../api/endpoints';
import { FileUploader } from '../../components/admin/FileUploader';
import { ConfirmModal } from '../../components/admin/ConfirmModal';

export const ProjectsManager = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const initialForm = {
    name: '',
    shortTitle: '',
    description: '',
    detailedDescription: '',
    imageUrl: '',
    techStack: '',
    githubUrl: '',
    liveDemoUrl: '',
    caseStudyUrl: '',
    projectDate: '',
    isFeatured: false,
    displayOrder: 0,
    isPublished: true,
  };

  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const loadProjects = async () => {
    try {
      const data = await projectsApi.getAll(true);
      setProjects(data);
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const openAddModal = () => {
    setEditingProject(null);
    setForm({
      ...initialForm,
      displayOrder: projects.length,
    });
    setModalOpen(true);
  };

  const openEditModal = (project) => {
    setEditingProject(project);
    const techStr = Array.isArray(project.techStack)
      ? project.techStack.join(', ')
      : typeof project.techStack === 'string'
      ? project.techStack
      : '';

    setForm({
      name: project.name,
      shortTitle: project.shortTitle || '',
      description: project.description || '',
      detailedDescription: project.detailedDescription || '',
      imageUrl: project.imageUrl || '',
      techStack: techStr,
      githubUrl: project.githubUrl || '',
      liveDemoUrl: project.liveDemoUrl || '',
      caseStudyUrl: project.caseStudyUrl || '',
      projectDate: project.projectDate || '',
      isFeatured: project.isFeatured || false,
      displayOrder: project.displayOrder ?? 0,
      isPublished: project.isPublished ?? true,
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        techStack: form.techStack.split(',').map((s) => s.trim()).filter(Boolean),
      };

      if (editingProject) {
        await projectsApi.update(editingProject.id, payload);
        setMessage('Project updated successfully!');
      } else {
        await projectsApi.create(payload);
        setMessage('Project created successfully!');
      }
      setModalOpen(false);
      loadProjects();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving project');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await projectsApi.delete(deleteTarget.id);
      setDeleteTarget(null);
      setMessage('Project deleted successfully!');
      loadProjects();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      alert('Failed to delete project');
    }
  };

  const handleTogglePublished = async (project) => {
    try {
      await projectsApi.update(project.id, { isPublished: !project.isPublished });
      loadProjects();
    } catch (err) {
      alert('Failed to update published status');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Projects Management
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Create, edit, feature, and publish your portfolio projects.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#00a2ff] text-slate-950 hover:bg-[#0091e6] transition-all shadow-lg shadow-sky-500/10 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Project
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
      ) : projects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-800 p-8 text-center bg-[#0d1322]/40">
          <FolderGit2 className="w-8 h-8 text-slate-500 mx-auto mb-2" />
          <p className="text-sm font-medium text-slate-300">No projects added yet.</p>
          <p className="text-xs text-slate-500 mt-1">
            The project database is empty. Click "Add Project" to add your first work.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project) => {
            const techs = Array.isArray(project.techStack)
              ? project.techStack
              : typeof project.techStack === 'string'
              ? JSON.parse(project.techStack || '[]')
              : [];

            return (
              <div
                key={project.id}
                className={`rounded-2xl border p-5 flex flex-col justify-between transition-all ${
                  project.isPublished
                    ? 'bg-[#0d1322] border-[#1b253b]'
                    : 'bg-[#0a0f1d] border-slate-900 opacity-60'
                }`}
              >
                <div>
                  {project.imageUrl && (
                    <div className="mb-3 rounded-xl overflow-hidden border border-slate-800 aspect-video">
                      <img
                        src={project.imageUrl}
                        alt={project.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-white">{project.name}</h3>
                        {project.isFeatured && (
                          <span className="text-[10px] font-bold text-amber-400 bg-amber-950/60 border border-amber-800/60 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                            <Star className="w-2.5 h-2.5 fill-current" /> Featured
                          </span>
                        )}
                      </div>
                      {project.shortTitle && (
                        <p className="text-xs text-sky-400 font-medium">{project.shortTitle}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleTogglePublished(project)}
                        title={project.isPublished ? 'Published (Click to unpublish)' : 'Draft (Click to publish)'}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          project.isPublished
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                            : 'bg-amber-950/60 text-amber-400 border border-amber-800/40'
                        }`}
                      >
                        {project.isPublished ? 'Published' : 'Draft'}
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                    {project.description}
                  </p>

                  {techs.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {techs.map((t, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
                  <div className="flex items-center gap-2">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-white"
                      >
                        <Github className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {project.liveDemoUrl && (
                      <a
                        href={project.liveDemoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-sky-400"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(project)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      title="Edit Project"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(project)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                      title="Delete Project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Project Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="bg-[#0d1322] border border-[#1b253b] rounded-2xl max-w-2xl w-full p-6 text-slate-200 shadow-2xl my-8">
            <h3 className="text-lg font-bold text-white mb-4">
              {editingProject ? 'Edit Project' : 'Add New Project'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Quantify"
                    required
                    className="w-full rounded-xl bg-[#070913] border border-slate-800 text-sm text-white px-3.5 py-2 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Short Title / Subtitle
                  </label>
                  <input
                    type="text"
                    value={form.shortTitle}
                    onChange={(e) => setForm({ ...form, shortTitle: e.target.value })}
                    placeholder="e.g. Secure Quiz Platform"
                    className="w-full rounded-xl bg-[#070913] border border-slate-800 text-sm text-white px-3.5 py-2 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Card Short Description *
                </label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="e.g. Role-based quiz platform with 2FA and security hardening."
                  required
                  className="w-full rounded-xl bg-[#070913] border border-slate-800 text-sm text-white px-3.5 py-2 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Detailed Description / Case Study
                </label>
                <textarea
                  value={form.detailedDescription}
                  onChange={(e) => setForm({ ...form, detailedDescription: e.target.value })}
                  rows={4}
                  placeholder="Provide comprehensive details, architectural decisions, and impact..."
                  className="w-full rounded-xl bg-[#070913] border border-slate-800 text-sm text-white px-3.5 py-2 focus:outline-none focus:border-sky-500"
                />
              </div>

              <FileUploader
                label="Project Screenshot / Banner"
                type="image"
                accept="image/*"
                value={form.imageUrl}
                onChange={(url) => setForm({ ...form, imageUrl: url })}
              />

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Tech Stack (Comma-separated)
                </label>
                <input
                  type="text"
                  value={form.techStack}
                  onChange={(e) => setForm({ ...form, techStack: e.target.value })}
                  placeholder="Flask, PostgreSQL, RBAC, Docker, Redis"
                  className="w-full rounded-xl bg-[#070913] border border-slate-800 text-sm text-white px-3.5 py-2 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={form.githubUrl}
                    onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full rounded-xl bg-[#070913] border border-slate-800 text-sm text-white px-3.5 py-2 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Live Demo URL
                  </label>
                  <input
                    type="url"
                    value={form.liveDemoUrl}
                    onChange={(e) => setForm({ ...form, liveDemoUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full rounded-xl bg-[#070913] border border-slate-800 text-sm text-white px-3.5 py-2 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Case Study URL
                  </label>
                  <input
                    type="url"
                    value={form.caseStudyUrl}
                    onChange={(e) => setForm({ ...form, caseStudyUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full rounded-xl bg-[#070913] border border-slate-800 text-sm text-white px-3.5 py-2 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Project Date / Year
                  </label>
                  <input
                    type="text"
                    value={form.projectDate}
                    onChange={(e) => setForm({ ...form, projectDate: e.target.value })}
                    placeholder="2026 / Summer 2026"
                    className="w-full rounded-xl bg-[#070913] border border-slate-800 text-sm text-white px-3.5 py-2 focus:outline-none focus:border-sky-500"
                  />
                </div>

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

                <div className="flex flex-col justify-center gap-1.5 pt-4">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-300">
                    <input
                      type="checkbox"
                      checked={form.isFeatured}
                      onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                      className="rounded border-slate-800 text-sky-500 focus:ring-0 w-4 h-4 bg-slate-900"
                    />
                    <span>Featured Project</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-300">
                    <input
                      type="checkbox"
                      checked={form.isPublished}
                      onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                      className="rounded border-slate-800 text-sky-500 focus:ring-0 w-4 h-4 bg-slate-900"
                    />
                    <span>Published (Visible publicly)</span>
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
                  {saving ? 'Saving...' : editingProject ? 'Update Project' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Deletion */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Project"
        message={`Are you sure you want to delete "${deleteTarget?.name}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
