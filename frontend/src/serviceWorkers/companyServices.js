import api from './api';

export const getCompanyInvoices = async (companyId) => {
  const res = await api.get(`/companies/${companyId}/invoices`);
  return res.data;
};

export const acceptInvoice = async (companyId, invoiceId) => {
  const res = await api.post(`/companies/${companyId}/invoices/${invoiceId}/accept`);
  return res.data;
};

export const payInvoice = async (companyId, invoiceId, paymentInfo) => {
  const res = await api.post(`/companies/${companyId}/invoices/${invoiceId}/pay`, paymentInfo);
  return res.data;
};