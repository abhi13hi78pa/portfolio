import { Profile } from '../models/Profile.js';

export const getProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      // Create initial placeholder profile record if none exists
      profile = await Profile.create({
        name: 'Your Name',
        role: 'Your Role',
        tagline: 'Your professional introduction',
        heroDescription: '',
        aboutHeading: 'About',
        aboutDescription: '',
        profileImageUrl: '',
        resumeUrl: '',
        primaryBtnText: 'Download Resume',
        secondaryBtnText: 'View Projects',
      });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = await Profile.create(req.body);
    } else {
      await profile.update(req.body);
    }
    res.json({ message: 'Profile updated successfully', profile });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
