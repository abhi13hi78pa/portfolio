import { Skill } from '../models/Skill.js';

export const getSkills = async (req, res) => {
  try {
    const isPublic = req.query.all !== 'true';
    const where = isPublic ? { isActive: true } : {};
    const skills = await Skill.findAll({
      where,
      order: [
        ['displayOrder', 'ASC'],
        ['id', 'ASC'],
      ],
    });
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createSkill = async (req, res) => {
  try {
    const { name, icon, category, proficiency, displayOrder, isActive } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Skill name is required' });
    }
    const skill = await Skill.create({
      name,
      icon: icon || '',
      category: category || 'General',
      proficiency: proficiency || '',
      displayOrder: displayOrder !== undefined ? displayOrder : 0,
      isActive: isActive !== undefined ? isActive : true,
    });
    res.status(201).json(skill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSkill = async (req, res) => {
  try {
    const skill = await Skill.findByPk(req.params.id);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    await skill.update(req.body);
    res.json(skill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findByPk(req.params.id);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    await skill.destroy();
    res.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const reorderSkills = async (req, res) => {
  try {
    const { items } = req.body; // array of { id, displayOrder }
    if (!Array.isArray(items)) {
      return res.status(400).json({ message: 'Items array is required' });
    }
    for (const item of items) {
      await Skill.update({ displayOrder: item.displayOrder }, { where: { id: item.id } });
    }
    res.json({ message: 'Skills reordered successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
