import React from 'react';
import { X, ExternalLink, Github, BookOpen, Calendar, Tag } from 'lucide-react';

export const ProjectModal = ({ project, onClose }) => {
  if (!project) return null;

  const techStack = Array.isArray(project.techStack)
    ? project.techStack
    : typeof project.techStack === 'string'
    ? JSON.parse(project.techStack || '[]')
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0d1322] border border-[#1b253b] rounded-2xl p-6 text-slate-200 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Project Image */}
        {project.imageUrl && (
          <div className="mb-5 overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
            <img
              src={project.imageUrl}
              alt={project.name}
              className="w-full max-h-72 object-cover"
            />
          </div>
        )}

        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              {project.name}
            </h3>
            {project.isFeatured && (
              <span className="text-[11px] font-semibold bg-sky-950 text-sky-400 border border-sky-800 px-2 py-0.5 rounded-full">
                Featured
              </span>
            )}
          </div>
          {project.shortTitle && (
            <p className="text-sky-400 text-sm font-medium">{project.shortTitle}</p>
          )}
          {project.projectDate && (
            <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
              <Calendar className="w-3.5 h-3.5" />
              {project.projectDate}
            </p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-3 mb-6 text-sm text-slate-300 leading-relaxed">
          <p>{project.description}</p>
          {project.detailedDescription && (
            <div className="pt-2 border-t border-slate-800/80 whitespace-pre-line text-slate-300">
              {project.detailedDescription}
            </div>
          )}
        </div>

        {/* Tech Stack */}
        {techStack.length > 0 && (
          <div className="mb-6">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" /> Technologies
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {techStack.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 text-xs rounded-md bg-[#141d33] border border-[#1e2a47] text-slate-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-800">
          {project.liveDemoUrl && (
            <a
              href={project.liveDemoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00a2ff] text-slate-950 text-sm font-semibold hover:bg-[#0091e6] transition-all"
            >
              <ExternalLink className="w-4 h-4" /> Live Demo
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-sm font-medium hover:bg-slate-800 hover:text-white transition-all"
            >
              <Github className="w-4 h-4" /> Source Code
            </a>
          )}
          {project.caseStudyUrl && (
            <a
              href={project.caseStudyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-sm font-medium hover:bg-slate-800 hover:text-white transition-all"
            >
              <BookOpen className="w-4 h-4" /> Case Study
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
