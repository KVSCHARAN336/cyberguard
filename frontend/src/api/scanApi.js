import api from './client';

export const scanDomain = async (domain, force = false) => {
  const response = await api.get(`/scan?domain=${encodeURIComponent(domain)}${force ? '&force=true' : ''}`);
  return response.data;
};

export const getScanHistory = async (search = '', limit = 20) => {
  const response = await api.get(`/history?search=${encodeURIComponent(search)}&limit=${limit}`);
  return response.data;
};

export const compareDomains = async (domainA, domainB) => {
  const response = await api.get(`/compare?domainA=${encodeURIComponent(domainA)}&domainB=${encodeURIComponent(domainB)}`);
  return response.data;
};

export const getPlatformStats = async () => {
  const response = await api.get('/stats');
  return response.data;
};
