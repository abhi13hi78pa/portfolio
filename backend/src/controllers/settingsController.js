import { Settings } from '../models/Settings.js';

export const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({
        pageTitle: 'Portfolio | Developer',
        metaDescription: 'Personal developer portfolio website showcasing projects, skills, and experience.',
        ogTitle: 'Developer Portfolio',
        ogDescription: 'Check out my latest projects and engineering work.',
        faviconUrl: '',
      });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create(req.body);
    } else {
      await settings.update(req.body);
    }
    res.json({ message: 'Settings updated successfully', settings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
