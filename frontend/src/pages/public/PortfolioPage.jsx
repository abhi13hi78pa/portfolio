import React, { useState, useEffect } from 'react';
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

export const PortfolioPage = () => {
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [codingProfiles, setCodingProfiles] = useState([]);
  const [socialLinks, setSocialLinks] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [
          profileData,
          skillsData,
          projectsData,
          experienceData,
          educationData,
          certificationsData,
          codingProfilesData,
          socialLinksData,
          settingsData,
        ] = await Promise.allSettled([
          profileApi.getProfile(),
          skillsApi.getAll(),
          projectsApi.getAll(),
          experienceApi.getAll(),
          educationApi.getAll(),
          certificationsApi.getAll(),
          codingProfilesApi.getAll(),
          socialLinksApi.getAll(),
          settingsApi.getSettings(),
        ]);

        if (profileData.status === 'fulfilled') setProfile(profileData.value);
        if (skillsData.status === 'fulfilled') setSkills(skillsData.value);
        if (projectsData.status === 'fulfilled') setProjects(projectsData.value);
        if (experienceData.status === 'fulfilled') setExperience(experienceData.value);
        if (educationData.status === 'fulfilled') setEducation(educationData.value);
        if (certificationsData.status === 'fulfilled') setCertifications(certificationsData.value);
        if (codingProfilesData.status === 'fulfilled') setCodingProfiles(codingProfilesData.value);
        if (socialLinksData.status === 'fulfilled') setSocialLinks(socialLinksData.value);
        if (settingsData.status === 'fulfilled') {
          setSettings(settingsData.value);
          if (settingsData.value?.pageTitle) {
            document.title = settingsData.value.pageTitle;
          }
        }
      } catch (err) {
        console.error('Error loading portfolio data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070913] flex flex-col items-center justify-center text-slate-400">
        <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold">Loading Portfolio...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070913] text-slate-200">
      <Navbar profile={profile} />

      <main className="max-w-3xl mx-auto px-4 sm:px-6">
        <HeroSection profile={profile} />
        <AboutSection profile={profile} />
        <SkillsSection skills={skills} />
        <ProjectsSection projects={projects} />
        <ExperienceSection experience={experience} />
        <EducationSection education={education} />
        <CertificationsSection certifications={certifications} />
        <CodingProfilesSection profiles={codingProfiles} />
        <ConnectSection links={socialLinks} profile={profile} />
        <Footer profile={profile} socialLinks={socialLinks} />
      </main>
    </div>
  );
};
