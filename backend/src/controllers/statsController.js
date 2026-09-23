import { Skill } from '../models/Skill.js';
import { Project } from '../models/Project.js';
import { Experience } from '../models/Experience.js';
import { Education } from '../models/Education.js';
import { Certification } from '../models/Certification.js';
import { CodingProfile } from '../models/CodingProfile.js';
import { SocialLink } from '../models/SocialLink.js';

export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalSkills,
      totalProjects,
      totalExperience,
      totalEducation,
      totalCertifications,
      totalCodingProfiles,
      totalSocialLinks,
    ] = await Promise.all([
      Skill.count(),
      Project.count(),
      Experience.count(),
      Education.count(),
      Certification.count(),
      CodingProfile.count(),
      SocialLink.count(),
    ]);

    res.json({
      totalSkills,
      totalProjects,
      totalExperience,
      totalEducation,
      totalCertifications,
      totalCodingProfiles,
      totalSocialLinks,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
