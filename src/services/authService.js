import api from '../api/axios';


export const getRole = async () => {
  try {
    const res = await api.get('/User/GetRole',{
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
    });
    return res.data.role[0];
  } catch (error) {
    throw error;
  }
}

export const login = async (credentials) => {
  try {
    const res = await api.post('/Account/Login', credentials);
    return res;
  } catch (error) {
    throw error;
  }
}

export const register = async (userInfo) => {
  try {
    const res = await api.post('/Account/Register', userInfo);
    return res;
  } catch (error) {
    throw error;
  }
}

export const userProfile = async () => {
  try {
    const res = await api.get('/User/UserProfile');
    return res;
  } catch (error) {
    throw error;
  }
}

export const userUpdate = async (formData) => {
  try {
    const res = await api.put('/User/Update', formData);
    return res;
  } catch (error) {
    throw error;
  }
}

export const getAllUsers = async (pageNumber) => {
  try {
    const res = await api.get(`/User/GetAllUsers?pageNumber=${pageNumber}`);
    return res;
  } catch (error) {
    throw error;
  }
}

export const tasksCount = async () => {
  try {
    const res = await api.get('/Task/Count');
    return res;
  } catch (error) {
    throw error;
  }
}

export const taskUpdate = async (id, formData) => {
  try {
    const res = await api.put(`/Task/Update/${id}`, formData);
    return res;
  } catch (error) {
    throw error;
  }
}

export const taskCreate = async (formData) => {
  try {
    const res = await api.post('/Task/Add', formData);
    return res;
  } catch (error) {
    throw error;
  }
}

export const taskDelete = async (id) => {
  try {
    const res = await api.delete(`/Task/Delete/${id}`);
    return res;
  } catch (error) {
    throw error;
  }
}

export const myTasks = async (pageNumber , status) => {
  try {
    const res = await api.get(`/Task/MyTasks?pageNumber=${pageNumber}&status=${status}`);
    return res;
  } catch (error) {
    throw error;
  }
}

export const allTasks = async (pageNumber) => {
  try {
    const res = await api.get(`/Task/GetAllTasks?pageNumber=${pageNumber}`);
    return res;
  } catch (error) {
    throw error;
  }
}

export const adminDelete = async (userId) => {
  try {
    const res = await api.delete(`/User/AdminDelete/${userId}`);
    return res;
  } catch (error) {
    throw error;
  }
}