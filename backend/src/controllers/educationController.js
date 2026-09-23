import { Education } from '../models/Education.js';

export const getEducation = async (req, res) => {
  try {
    const list = await Education.findAll({
      order: [
        ['displayOrder', 'ASC'],
        ['startYear', 'DESC'],
      ],
    });
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createEducation = async (req, res) => {
  try {
    const { institution, degree, fieldOfStudy, startYear, endYear, grade, description, displayOrder } = req.body;
    if (!institution || !degree) {
      return res.status(400).json({ message: 'Institution and Degree are required' });
    }
    const item = await Education.create({
      institution,
      degree,
      fieldOfStudy: fieldOfStudy || '',
      startYear: startYear || '',
      endYear: endYear || '',
      grade: grade || '',
      description: description || '',
      displayOrder: displayOrder !== undefined ? displayOrder : 0,
    });
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateEducation = async (req, res) => {
  try {
    const item = await Education.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Education entry not found' });
    }
    await item.update(req.body);
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteEducation = async (req, res) => {
  try {
    const item = await Education.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Education entry not found' });
    }
    await item.destroy();
    res.json({ message: 'Education entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
