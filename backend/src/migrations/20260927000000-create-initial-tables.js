import { DataTypes } from 'sequelize';

export const up = async ({ context: queryInterface }) => {
  // 1. Admins Table
  await queryInterface.createTable('Admins', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: 'admin',
    },
    twoFactorEnabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    twoFactorSecret: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, { ifNotExists: true });

  // 2. Profiles Table
  await queryInterface.createTable('Profiles', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      defaultValue: 'Your Name',
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: 'Your Role',
    },
    tagline: {
      type: DataTypes.TEXT,
      defaultValue: 'Your professional introduction',
    },
    heroDescription: {
      type: DataTypes.TEXT,
      defaultValue: '',
    },
    aboutHeading: {
      type: DataTypes.STRING,
      defaultValue: 'About',
    },
    aboutDescription: {
      type: DataTypes.TEXT,
      defaultValue: '',
    },
    profileImageUrl: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    resumeUrl: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    primaryBtnText: {
      type: DataTypes.STRING,
      defaultValue: 'Download Resume',
    },
    secondaryBtnText: {
      type: DataTypes.STRING,
      defaultValue: 'View Projects',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, { ifNotExists: true });

  // 3. Skills Table
  await queryInterface.createTable('Skills', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    icon: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    category: {
      type: DataTypes.STRING,
      defaultValue: 'General',
    },
    proficiency: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    displayOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, { ifNotExists: true });

  // 4. Projects Table
  await queryInterface.createTable('Projects', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shortTitle: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    description: {
      type: DataTypes.TEXT,
      defaultValue: '',
    },
    detailedDescription: {
      type: DataTypes.TEXT,
      defaultValue: '',
    },
    imageUrl: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    techStack: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    githubUrl: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    liveDemoUrl: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    caseStudyUrl: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    projectDate: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    displayOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    isPublished: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, { ifNotExists: true });

  // 5. Experiences Table
  await queryInterface.createTable('Experiences', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    jobTitle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    company: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    startDate: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    endDate: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    isCurrent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    description: {
      type: DataTypes.TEXT,
      defaultValue: '',
    },
    technologies: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    displayOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, { ifNotExists: true });

  // 6. Education Table
  await queryInterface.createTable('Education', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    institution: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    degree: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fieldOfStudy: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    startYear: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    endYear: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    grade: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    description: {
      type: DataTypes.TEXT,
      defaultValue: '',
    },
    displayOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, { ifNotExists: true });

  // 7. Certifications Table
  await queryInterface.createTable('Certifications', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    issuingOrg: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    issueDate: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    credentialId: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    credentialUrl: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    certificateFileUrl: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    displayOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, { ifNotExists: true });

  // 8. CodingProfiles Table
  await queryInterface.createTable('CodingProfiles', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    platform: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    icon: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    displayOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, { ifNotExists: true });

  // 9. SocialLinks Table
  await queryInterface.createTable('SocialLinks', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    platform: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    urlOrValue: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    icon: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    displayOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, { ifNotExists: true });

  // 10. Settings Table
  await queryInterface.createTable('Settings', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    pageTitle: {
      type: DataTypes.STRING,
      defaultValue: 'Portfolio | Full Stack Developer',
    },
    metaDescription: {
      type: DataTypes.TEXT,
      defaultValue: 'Personal developer portfolio website showcasing projects, skills, and experience.',
    },
    ogTitle: {
      type: DataTypes.STRING,
      defaultValue: 'Developer Portfolio',
    },
    ogDescription: {
      type: DataTypes.TEXT,
      defaultValue: 'Check out my latest projects and skills.',
    },
    faviconUrl: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, { ifNotExists: true });
};

export const down = async ({ context: queryInterface }) => {
  // Do not drop existing production tables in down to protect production data
};
