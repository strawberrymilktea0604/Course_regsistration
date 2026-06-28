import apiClient from '../config/api-config';

export const getStudentProfile = async () => {
  const response = await apiClient.get('/students/profile');
  return response.data.data; // assuming backend returns { success, data }
};