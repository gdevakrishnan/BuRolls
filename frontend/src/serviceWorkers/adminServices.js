import api from './api';

export const getOverview = async () => {
  const res = await api.get('/admin/overview');
  return res.data;
};

export const getStats = async () => {
  const res = await api.get('/admin/stats');
  return res.data;
};

export const getManagers = async (params = {}) => {
  const res = await api.get('/admin/managers', { params });
  return res.data;
};

export const getUsers = async (params = {}) => {
  const res = await api.get('/admin/users', { params });
  return res.data;
};

export const getInvoices = async (params = {}) => {
  const res = await api.get('/admin/invoices', { params });
  return res.data;
};

export const getInvoice = async (id) => {
  const res = await api.get(`/admin/invoices/${id}`);
  return res.data;
};

export const adminUpdateInvoice = async (id, payload) => {
  const res = await api.put(`/admin/invoices/${id}`, payload);
  return res.data;
};