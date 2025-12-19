import api from './api';

export const getOverview = async () => {
  const res = await api.get('/admin/overview');
  return res.data;
};

export const getStats = async () => {
  const res = await api.get('/admin/stats');
  return res.data;
};