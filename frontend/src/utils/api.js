import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001',
  withCredentials: true,
});

export async function registerOrLogin(url, username, password) {
  try {
    const userData = await api.post(`/${url}`, { username, password });
    return userData.data;
  } catch (error) {
    console.error('Erro ao fazer a requisição:', error);
    return null;
  }
}

export async function checkUser() {
  try {
    const userData = await api.get('/profile');
    return userData.data;
  } catch (error) {
    console.error('Erro ao fazer a requisição:', error);
    return null;
  }
}

