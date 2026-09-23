import { Experience } from '../models/Experience.js';

export const getExperience = async (req, res) => {
  try {
    const isPublic = req.query.all !== 'true';
    const where = isPublic ? { isActive: true } : {};
    const list = await Experience.findAll({
      where,
      order: [
        ['displayOrder', 'ASC'],
        ['startDate', 'DESC'],
      ],
    });
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createExperience = async (req, res) => {
  try {
    const { jobTitle, company, location, startDate, endDate, isCurrent, description, technologies, displayOrder, isActive } = req.body;
    if (!jobTitle || !company) {
      return res.status(400).json({ message: 'Job title and Company are required' });
    }
    const item = await Experience.create({
      jobTitle,
      company,
      location: location || '',
      startDate: startDate || '',
      endDate: endDate || '',
      isCurrent: isCurrent !== undefined ? isCurrent : false,
      description: description || '',
      technologies: Array.isArray(technologies) ? technologies : (typeof technologies === 'string' && technologies.trim() ? technologies.split(',').map(s => s.trim()) : []),
      displayOrder: displayOrder !== undefined ? displayOrder : 0,
      isActive: isActive !== undefined ? isActive : true,
    });
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateExperience = async (req, res) => {
  try {
    const item = await Experience.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Experience entry not found' });
    }
    const updates = { ...req.body };
    if (typeof updates.technologies === 'string') {
      updates.technologies = updates.technologies.split(',').map(s => s.trim()).filter(Boolean);
    }
    await item.update(updates);
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteExperience = async (req, res) => {
  try {
    const item = await Experience.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Experience entry not found' });
    }
    await item.destroy();
    res.json({ message: 'Experience entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
