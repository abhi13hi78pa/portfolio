import { SocialLink } from '../models/SocialLink.js';

export const getSocialLinks = async (req, res) => {
  try {
    const isPublic = req.query.all !== 'true';
    const where = isPublic ? { isActive: true } : {};
    const list = await SocialLink.findAll({
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

export const createSocialLink = async (req, res) => {
  try {
    const { platform, urlOrValue, icon, displayOrder, isActive } = req.body;
    if (!platform || !urlOrValue) {
      return res.status(400).json({ message: 'Platform and URL/Value are required' });
    }
    const item = await SocialLink.create({
      platform,
      urlOrValue,
      icon: icon || '',
      displayOrder: displayOrder !== undefined ? displayOrder : 0,
      isActive: isActive !== undefined ? isActive : true,
    });
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSocialLink = async (req, res) => {
  try {
    const item = await SocialLink.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Social link not found' });
    }
    await item.update(req.body);
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteSocialLink = async (req, res) => {
  try {
    const item = await SocialLink.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Social link not found' });
    }
    await item.destroy();
    res.json({ message: 'Social link deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
