import { Project } from '../models/Project.js';

export const getProjects = async (req, res) => {
  try {
    const isPublic = req.query.all !== 'true';
    const where = isPublic ? { isPublished: true } : {};
    const projects = await Project.findAll({
      where,
      order: [
        ['displayOrder', 'ASC'],
        ['id', 'DESC'],
      ],
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProject = async (req, res) => {
  try {
    const {
      name,
      shortTitle,
      description,
      detailedDescription,
      imageUrl,
      techStack,
      githubUrl,
      liveDemoUrl,
      caseStudyUrl,
      projectDate,
      isFeatured,
      displayOrder,
      isPublished,
    } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Project name is required' });
    }

    const project = await Project.create({
      name,
      shortTitle: shortTitle || '',
      description: description || '',
      detailedDescription: detailedDescription || '',
      imageUrl: imageUrl || '',
      techStack: Array.isArray(techStack) ? techStack : (typeof techStack === 'string' && techStack.trim() ? techStack.split(',').map(s => s.trim()) : []),
      githubUrl: githubUrl || '',
      liveDemoUrl: liveDemoUrl || '',
      caseStudyUrl: caseStudyUrl || '',
      projectDate: projectDate || '',
      isFeatured: isFeatured !== undefined ? isFeatured : false,
      displayOrder: displayOrder !== undefined ? displayOrder : 0,
      isPublished: isPublished !== undefined ? isPublished : true,
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const updates = { ...req.body };
    if (typeof updates.techStack === 'string') {
      updates.techStack = updates.techStack.split(',').map(s => s.trim()).filter(Boolean);
    }

    await project.update(updates);
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    await project.destroy();
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const reorderProjects = async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items)) {
      return res.status(400).json({ message: 'Items array is required' });
    }
    for (const item of items) {
      await Project.update({ displayOrder: item.displayOrder }, { where: { id: item.id } });
    }
    res.json({ message: 'Projects reordered successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
