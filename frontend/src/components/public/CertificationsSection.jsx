import React from 'react';
import { Award, ExternalLink, Calendar, FileText } from 'lucide-react';
import { EmptyState } from './EmptyState';

export const CertificationsSection = ({ certifications = [] }) => {
  return (
    <section id="certifications" className="py-10 border-t border-slate-900/60">
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">
        Certifications
      </h2>

      {certifications.length === 0 ? (
        <EmptyState
          type="certifications"
          message="No certifications added yet."
          description="Certificates and professional licenses will display here once added in Admin."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {certifications.map((cert) => (
            <div
              key={cert.id}
              className="rounded-2xl bg-[#0d1322] border border-[#1b253b] hover:border-slate-700/80 p-5 flex flex-col justify-between transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-base font-bold text-white">
                    {cert.name}
                  </h3>
                  <Award className="w-5 h-5 text-sky-400 shrink-0" />
                </div>

                <p className="text-sm font-medium text-sky-400 mb-2">
                  {cert.issuingOrg}
                </p>

                {cert.issueDate && (
                  <p className="text-xs text-slate-500 flex items-center gap-1.5 mb-2">
                    <Calendar className="w-3.5 h-3.5" />
                    Issued: {cert.issueDate}
                  </p>
                )}

                {cert.credentialId && (
                  <p className="text-xs text-slate-400 font-mono mb-3">
                    ID: {cert.credentialId}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-slate-800/80">
                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-400 hover:text-sky-300 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Verify Credential
                  </a>
                )}
                {cert.certificateFileUrl && (
                  <a
                    href={cert.certificateFileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" /> View Certificate
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
