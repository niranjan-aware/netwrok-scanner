
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const scanAPI = {
  startScan: (data) => api.post('/scans', data),
  getScanStatus: (jobId) => api.get(`/scans/${jobId}`),
  getScanResults: (jobId) => api.get(`/scans/${jobId}/results`),
  getAllScans: (page = 0, size = 10) => api.get(`/scans?page=${page}&size=${size}`),
  deleteScan: (jobId) => api.delete(`/scans/${jobId}`),
};

export const scheduledScanAPI = {
  createScheduledScan: (data) => api.post('/scheduled-scans', data),
  getAllScheduledScans: () => api.get('/scheduled-scans'),
  getScheduledScan: (id) => api.get(`/scheduled-scans/${id}`),
  updateScheduledScan: (id, data) => api.put(`/scheduled-scans/${id}`, data),
  toggleScheduledScan: (id) => api.patch(`/scheduled-scans/${id}/toggle`),
  deleteScheduledScan: (id) => api.delete(`/scheduled-scans/${id}`),
};

export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
};

export default api;
