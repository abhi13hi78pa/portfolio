import { CodingProfile } from '../models/CodingProfile.js';

export const getCodingProfiles = async (req, res) => {
  try {
    const isPublic = req.query.all !== 'true';
    const where = isPublic ? { isActive: true } : {};
    const list = await CodingProfile.findAll({
      where,
      order: [
        ['displayOrder', 'ASC'],
        ['id', 'ASC'],
      ],
    });
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCodingProfile = async (req, res) => {
  try {
    const { platformName, username, url, icon, displayOrder, isActive } = req.body;
    if (!platformName || !url) {
      return res.status(400).json({ message: 'Platform name and URL are required' });
    }
    const item = await CodingProfile.create({
      platformName,
      username: username || '',
      url,
      icon: icon || '',
      displayOrder: displayOrder !== undefined ? displayOrder : 0,
      isActive: isActive !== undefined ? isActive : true,
    });
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCodingProfile = async (req, res) => {
  try {
    const item = await CodingProfile.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Coding profile not found' });
    }
    await item.update(req.body);
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCodingProfile = async (req, res) => {
  try {
    const item = await CodingProfile.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Coding profile not found' });
    }
    await item.destroy();
    res.json({ message: 'Coding profile deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
