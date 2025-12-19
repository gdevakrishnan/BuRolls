import api from './api';

export const getBusinessUnits = async () => {
  const res = await api.get('/business-units');
  return res.data;
};

export const createBusinessUnit = async (payload) => {
  const res = await api.post('/business-units', payload);
  return res.data;
};

export const updateBusinessUnit = async (id, payload) => {
  const res = await api.put(`/business-units/${id}`, payload);
  return res.data;
};

export const assignManager = async (id, payload) => {
  const res = await api.post(`/business-units/${id}/assign-manager`, payload);
  return res.data;
};