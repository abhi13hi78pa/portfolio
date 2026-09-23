import React, { useState } from 'react';
import { ExternalLink, Github, Eye } from 'lucide-react';
import { ProjectModal } from './ProjectModal';
import { EmptyState } from './EmptyState';

export const ProjectsSection = ({ projects = [] }) => {
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <section id="projects" className="py-10 border-t border-slate-900/60">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white">
          Projects
        </h2>
      </div>

      {projects.length === 0 ? (
        <EmptyState
          type="projects"
          message="No projects added yet."
          description="Projects added via the Admin Dashboard will automatically display here."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project) => {
            const techStack = Array.isArray(project.techStack)
              ? project.techStack
              : typeof project.techStack === 'string'
              ? JSON.parse(project.techStack || '[]')
              : [];

            return (
              <div
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className="group cursor-pointer rounded-2xl bg-[#0d1322] border border-[#1b253b] hover:border-slate-700/80 p-5 sm:p-6 transition-all duration-200 flex flex-col justify-between hover:bg-[#10182b]"
              >
                <div>
                  {project.imageUrl && (
                    <div className="mb-4 overflow-hidden rounded-xl border border-slate-800/80 bg-slate-950 aspect-video">
                      <img
                        src={project.imageUrl}
                        alt={project.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-sky-400 transition-colors">
                      {project.name}
                    </h3>
                    <div className="flex items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          title="Source Code"
                          className="text-slate-400 hover:text-white transition-colors"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                      {project.liveDemoUrl && (
                        <a
                          href={project.liveDemoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          title="Live Demo"
                          className="text-slate-400 hover:text-sky-400 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>

                  <p className="text-slate-400 text-xs sm:text-sm line-clamp-2 leading-relaxed mb-4">
                    {project.description || project.shortTitle}
                  </p>
                </div>

                {techStack.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {techStack.map((tech, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-medium text-slate-400 bg-[#141d33] border border-[#1e2a47] px-2 py-0.5 rounded-md"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  );
};
