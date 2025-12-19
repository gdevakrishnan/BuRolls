import api from './api';

export const getManagerCompanies = async () => {
  const res = await api.get('/manager/companies');
  return res.data;
};

export const createCompany = async (payload) => {
  const res = await api.post('/manager/companies', payload);
  return res.data;
};

export const getCompanyUsers = async (companyId) => {
  const res = await api.get(`/manager/companies/${companyId}/users`);
  return res.data;
};

export const createCompanyUser = async (companyId, payload) => {
  const res = await api.post(`/manager/companies/${companyId}/users`, payload);
  return res.data;
};

export const getAssignedBusinessUnits = async () => {
  const res = await api.get('/manager/business-units');
  return res.data;
};

export const getStats = async () => {
  const res = await api.get('/manager/stats');
  return res.data;
};