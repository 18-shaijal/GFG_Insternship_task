// src/apiService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000'; // Update to match your backend URL

export const fetchTransactions = (month, searchTerm, page = 1, perPage = 10) => {
  return axios.get(`${API_BASE_URL}/transactions`, {
    params: { month, search: searchTerm, page, perPage }
  });
};

export const fetchStatistics = (month) => {
  return axios.get(`${API_BASE_URL}/statistics`, {
    params: { month }
  });
};

export const fetchBarChartData = (month) => {
  return axios.get(`${API_BASE_URL}/bar-chart`, {
    params: { month }
  });
};

export const fetchPieChartData = (month) => {
  return axios.get(`${API_BASE_URL}/pie-chart`, {
    params: { month }
  });
};
