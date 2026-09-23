import { Certification } from '../models/Certification.js';

export const getCertifications = async (req, res) => {
  try {
    const isPublic = req.query.all !== 'true';
    const where = isPublic ? { isActive: true } : {};
    const list = await Certification.findAll({
      where,
      order: [
        ['displayOrder', 'ASC'],
        ['issueDate', 'DESC'],
      ],
    });
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCertification = async (req, res) => {
  try {
    const { name, issuingOrg, issueDate, credentialId, credentialUrl, certificateFileUrl, displayOrder, isActive } = req.body;
    if (!name || !issuingOrg) {
      return res.status(400).json({ message: 'Certification name and Issuing organization are required' });
    }
    const item = await Certification.create({
      name,
      issuingOrg,
      issueDate: issueDate || '',
      credentialId: credentialId || '',
      credentialUrl: credentialUrl || '',
      certificateFileUrl: certificateFileUrl || '',
      displayOrder: displayOrder !== undefined ? displayOrder : 0,
      isActive: isActive !== undefined ? isActive : true,
    });
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCertification = async (req, res) => {
  try {
    const item = await Certification.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Certification not found' });
    }
    await item.update(req.body);
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCertification = async (req, res) => {
  try {
    const item = await Certification.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Certification not found' });
    }
    await item.destroy();
    res.json({ message: 'Certification deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
