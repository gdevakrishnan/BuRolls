import api from './api';

export const createManager = async (payload) => {
  const res = await api.post('/users/create-manager', payload);
  return res.data;
};

export const requestUser = async (payload) => {
  const res = await api.post('/users/request', payload);
  return res.data;
};

export const getCurrentUser = async () => {
  const res = await api.get('/users/me');
  return res.data;
};