import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  profileApi,
  skillsApi,
  projectsApi,
  experienceApi,
  educationApi,
  certificationsApi,
  codingProfilesApi,
  socialLinksApi,
  settingsApi,
} from '../../api/endpoints';

import { Navbar } from '../../components/public/Navbar';
import { HeroSection } from '../../components/public/HeroSection';
import { AboutSection } from '../../components/public/AboutSection';
import { SkillsSection } from '../../components/public/SkillsSection';
import { ProjectsSection } from '../../components/public/ProjectsSection';
import { ExperienceSection } from '../../components/public/ExperienceSection';
import { EducationSection } from '../../components/public/EducationSection';
import { CertificationsSection } from '../../components/public/CertificationsSection';
import { CodingProfilesSection } from '../../components/public/CodingProfilesSection';
import { ConnectSection } from '../../components/public/ConnectSection';
import { Footer } from '../../components/public/Footer';
import { SectionSkeleton } from '../../components/public/SectionSkeleton';
import { SectionError } from '../../components/public/SectionError';

export const PortfolioPage = () => {
  // Query 1: Profile & Hero
  const {
    data: profile,
    isLoading: isProfileLoading,
    isError: isProfileError,
    refetch: refetchProfile,
  } = useQuery({
    queryKey: ['portfolio', 'profile'],
    queryFn: profileApi.getProfile,
    staleTime: 5 * 60 * 1000,
  });

  // Query 2: Skills
  const {
    data: skills = [],
    isLoading: isSkillsLoading,
    isError: isSkillsError,
    refetch: refetchSkills,
  } = useQuery({
    queryKey: ['portfolio', 'skills'],
    queryFn: () => skillsApi.getAll(false),
    staleTime: 5 * 60 * 1000,
  });

  // Query 3: Projects
  const {
    data: projects = [],
    isLoading: isProjectsLoading,
    isError: isProjectsError,
    refetch: refetchProjects,
  } = useQuery({
    queryKey: ['portfolio', 'projects'],
    queryFn: () => projectsApi.getAll(false),
    staleTime: 5 * 60 * 1000,
  });

  // Query 4: Experience
  const {
    data: experience = [],
    isLoading: isExperienceLoading,
    isError: isExperienceError,
    refetch: refetchExperience,
  } = useQuery({
    queryKey: ['portfolio', 'experience'],
    queryFn: () => experienceApi.getAll(false),
    staleTime: 5 * 60 * 1000,
  });

  // Query 5: Education
  const {
    data: education = [],
    isLoading: isEducationLoading,
    isError: isEducationError,
    refetch: refetchEducation,
  } = useQuery({
    queryKey: ['portfolio', 'education'],
    queryFn: educationApi.getAll,
    staleTime: 5 * 60 * 1000,
  });

  // Query 6: Certifications
  const {
    data: certifications = [],
    isLoading: isCertificationsLoading,
    isError: isCertificationsError,
    refetch: refetchCertifications,
  } = useQuery({
    queryKey: ['portfolio', 'certifications'],
    queryFn: () => certificationsApi.getAll(false),
    staleTime: 5 * 60 * 1000,
  });

  // Query 7: Coding Profiles
  const {
    data: codingProfiles = [],
    isLoading: isCodingProfilesLoading,
    isError: isCodingProfilesError,
    refetch: refetchCodingProfiles,
  } = useQuery({
    queryKey: ['portfolio', 'coding-profiles'],
    queryFn: () => codingProfilesApi.getAll(false),
    staleTime: 5 * 60 * 1000,
  });

  // Query 8: Social Links
  const {
    data: socialLinks = [],
    isLoading: isSocialLinksLoading,
    isError: isSocialLinksError,
    refetch: refetchSocialLinks,
  } = useQuery({
    queryKey: ['portfolio', 'social-links'],
    queryFn: () => socialLinksApi.getAll(false),
    staleTime: 5 * 60 * 1000,
  });

  // Query 9: Settings (SEO / metadata)
  const { data: settings } = useQuery({
    queryKey: ['portfolio', 'settings'],
    queryFn: settingsApi.getSettings,
    staleTime: 10 * 60 * 1000,
  });

  // Synchronize document title with CMS Settings
  useEffect(() => {
    if (settings?.pageTitle) {
      document.title = settings.pageTitle;
    }
  }, [settings?.pageTitle]);

  return (
    <div className="min-h-screen bg-[#070913] text-slate-200">
      <Navbar profile={profile} />

      <main className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Hero Section */}
        {isProfileLoading ? (
          <SectionSkeleton type="hero" />
        ) : isProfileError ? (
          <SectionError title="Failed to load profile" onRetry={refetchProfile} />
        ) : (
          <HeroSection profile={profile} />
        )}

        {/* About Section (if present) */}
        {profile?.aboutDescription && (
          <AboutSection profile={profile} />
        )}

        {/* Skills Section */}
        {isSkillsLoading ? (
          <SectionSkeleton title="Skills" type="badges" />
        ) : isSkillsError ? (
          <SectionError title="Failed to load skills" onRetry={refetchSkills} />
        ) : (
          <SkillsSection skills={skills} />
        )}

        {/* Projects Section */}
        {isProjectsLoading ? (
          <SectionSkeleton title="Projects" count={2} type="card" />
        ) : isProjectsError ? (
          <SectionError title="Failed to load projects" onRetry={refetchProjects} />
        ) : (
          <ProjectsSection projects={projects} />
        )}

        {/* Experience Section */}
        {isExperienceLoading ? (
          <SectionSkeleton title="Experience" count={2} type="list" />
        ) : isExperienceError ? (
          <SectionError title="Failed to load experience" onRetry={refetchExperience} />
        ) : (
          <ExperienceSection experience={experience} />
        )}

        {/* Education Section */}
        {isEducationLoading ? (
          <SectionSkeleton title="Education" count={2} type="list" />
        ) : isEducationError ? (
          <SectionError title="Failed to load education" onRetry={refetchEducation} />
        ) : (
          <EducationSection education={education} />
        )}

        {/* Certifications Section */}
        {isCertificationsLoading ? (
          <SectionSkeleton title="Certifications" count={2} type="card" />
        ) : isCertificationsError ? (
          <SectionError title="Failed to load certifications" onRetry={refetchCertifications} />
        ) : (
          <CertificationsSection certifications={certifications} />
        )}

        {/* Coding Profiles Section */}
        {isCodingProfilesLoading ? (
          <SectionSkeleton title="Coding Profiles" count={2} type="badges" />
        ) : isCodingProfilesError ? (
          <SectionError title="Failed to load coding profiles" onRetry={refetchCodingProfiles} />
        ) : (
          <CodingProfilesSection profiles={codingProfiles} />
        )}

        {/* Connect Section */}
        {isSocialLinksLoading ? (
          <SectionSkeleton title="Connect" count={2} type="badges" />
        ) : isSocialLinksError ? (
          <SectionError title="Failed to load contact links" onRetry={refetchSocialLinks} />
        ) : (
          <ConnectSection links={socialLinks} profile={profile} />
        )}

        {/* Footer */}
        <Footer profile={profile} socialLinks={socialLinks} />
      </main>
    </div>
  );
};
