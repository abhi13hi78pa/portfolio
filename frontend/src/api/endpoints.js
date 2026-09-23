import axiosClient from './axiosClient';

export const authApi = {
  login: (data) => axiosClient.post('/auth/login', data).then(r => r.data),
  verify2FA: (data) => axiosClient.post('/auth/verify-2fa', data).then(r => r.data),
  generate2FA: () => axiosClient.post('/auth/2fa/generate').then(r => r.data),
  enable2FA: (data) => axiosClient.post('/auth/2fa/enable', data).then(r => r.data),
  disable2FA: (data) => axiosClient.post('/auth/2fa/disable', data).then(r => r.data),
  getMe: () => axiosClient.get('/auth/me').then(r => r.data),
  changePassword: (data) => axiosClient.post('/auth/change-password', data).then(r => r.data),
};

export const profileApi = {
  getProfile: () => axiosClient.get('/profile').then(r => r.data),
  updateProfile: (data) => axiosClient.put('/profile', data).then(r => r.data),
};

export const skillsApi = {
  getAll: (all = false) => axiosClient.get(`/skills${all ? '?all=true' : ''}`).then(r => r.data),
  create: (data) => axiosClient.post('/skills', data).then(r => r.data),
  update: (id, data) => axiosClient.put(`/skills/${id}`, data).then(r => r.data),
  delete: (id) => axiosClient.delete(`/skills/${id}`).then(r => r.data),
  reorder: (items) => axiosClient.put('/skills/reorder', { items }).then(r => r.data),
};

export const projectsApi = {
  getAll: (all = false) => axiosClient.get(`/projects${all ? '?all=true' : ''}`).then(r => r.data),
  getById: (id) => axiosClient.get(`/projects/${id}`).then(r => r.data),
  create: (data) => axiosClient.post('/projects', data).then(r => r.data),
  update: (id, data) => axiosClient.put(`/projects/${id}`, data).then(r => r.data),
  delete: (id) => axiosClient.delete(`/projects/${id}`).then(r => r.data),
  reorder: (items) => axiosClient.put('/projects/reorder', { items }).then(r => r.data),
};

export const experienceApi = {
  getAll: (all = false) => axiosClient.get(`/experience${all ? '?all=true' : ''}`).then(r => r.data),
  create: (data) => axiosClient.post('/experience', data).then(r => r.data),
  update: (id, data) => axiosClient.put(`/experience/${id}`, data).then(r => r.data),
  delete: (id) => axiosClient.delete(`/experience/${id}`).then(r => r.data),
};

export const educationApi = {
  getAll: () => axiosClient.get('/education').then(r => r.data),
  create: (data) => axiosClient.post('/education', data).then(r => r.data),
  update: (id, data) => axiosClient.put(`/education/${id}`, data).then(r => r.data),
  delete: (id) => axiosClient.delete(`/education/${id}`).then(r => r.data),
};

export const certificationsApi = {
  getAll: (all = false) => axiosClient.get(`/certifications${all ? '?all=true' : ''}`).then(r => r.data),
  create: (data) => axiosClient.post('/certifications', data).then(r => r.data),
  update: (id, data) => axiosClient.put(`/certifications/${id}`, data).then(r => r.data),
  delete: (id) => axiosClient.delete(`/certifications/${id}`).then(r => r.data),
};

export const codingProfilesApi = {
  getAll: (all = false) => axiosClient.get(`/coding-profiles${all ? '?all=true' : ''}`).then(r => r.data),
  create: (data) => axiosClient.post('/coding-profiles', data).then(r => r.data),
  update: (id, data) => axiosClient.put(`/coding-profiles/${id}`, data).then(r => r.data),
  delete: (id) => axiosClient.delete(`/coding-profiles/${id}`).then(r => r.data),
};

export const socialLinksApi = {
  getAll: (all = false) => axiosClient.get(`/social-links${all ? '?all=true' : ''}`).then(r => r.data),
  create: (data) => axiosClient.post('/social-links', data).then(r => r.data),
  update: (id, data) => axiosClient.put(`/social-links/${id}`, data).then(r => r.data),
  delete: (id) => axiosClient.delete(`/social-links/${id}`).then(r => r.data),
};

export const statsApi = {
  getStats: () => axiosClient.get('/stats').then(r => r.data),
};

export const settingsApi = {
  getSettings: () => axiosClient.get('/settings').then(r => r.data),
  updateSettings: (data) => axiosClient.put('/settings', data).then(r => r.data),
};

export const uploadApi = {
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return axiosClient.post('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data);
  },
  uploadResume: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return axiosClient.post('/upload/resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data);
  },
};
