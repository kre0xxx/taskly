import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production' 
  ? '/api'  // для продакшена
  : 'http://localhost:3001'; // для разработки

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});


// api.interceptors.response.use(
//   response => response,
//   error => {
//     console.error('API Error:', error.message);
//     if (error.code === 'ERR_NETWORK') {
//       alert('Сервер не запущен! Запустите JSON Server командой: npm run server');
//     }
//     return Promise.reject(error);
//   }
// );

// Функция для проверки существования имени пользователя
const checkUsernameExists = async (username) => {
  try {
    const response = await api.get('/users', {
      params: { username }
    });
    return response.data.length > 0;
  } catch (error) {
    console.error('Error checking username:', error);
    return false;
  }
};

// Имитация аутентификации (поскольку у нас нет реального бэкенда)
export const authService = {
  async login(username, password) {
    try {
      const response = await api.get('/users', {
        params: { username, password }
      });
      
      const user = response.data.find(u => 
        u.username === username && u.password === password
      );
      
      if (user) {
        const token = btoa(`${username}:${Date.now()}`);
        const userData = {
          ...user,
          token
        };
        localStorage.setItem('user', JSON.stringify(userData));
        return userData;
      }
      throw new Error('Неверные учетные данные');
    } catch (error) {
      console.error('Login error:', error);
      if (error.code === 'ERR_NETWORK') {
        return this.mockLogin(username, password);
      }
      throw error;
    }
  },

  // Моковая аутентификация для разработки
  mockLogin(username, password) {
    const mockUsers = [
      { id: 1, username: 'admin', password: 'admin123', firstName: 'Алексей', lastName: 'Иванов', role: 'admin', createdAt: '2024-01-01T00:00:00.000Z' },
      { id: 2, username: 'user1', password: 'user123', firstName: 'Мария', lastName: 'Петрова', role: 'user', createdAt: '2024-01-01T00:00:00.000Z' },
      { id: 3, username: 'user2', password: 'user123', firstName: 'Иван', lastName: 'Сидоров', role: 'user', createdAt: '2024-01-01T00:00:00.000Z' }
    ];
    
    const user = mockUsers.find(u => 
      u.username === username && u.password === password
    );
    
    if (user) {
      const token = btoa(`${username}:${Date.now()}`);
      const userData = { ...user, token };
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    }
    throw new Error('Неверные учетные данные');
  },

  async register(userData) {
    try {
      const usernameExists = await checkUsernameExists(userData.username);
      if (usernameExists) {
        throw new Error('Пользователь с таким логином уже существует');
      }

      const response = await api.post('/users', {
        ...userData,
        createdAt: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      if (error.code === 'ERR_NETWORK') {
        return this.mockRegister(userData);
      }
      throw error;
    }
  },

  mockRegister(userData) {
    const newUser = {
      ...userData,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    alert('Пользователь создан локально (сервер не запущен)');
    return newUser;
  },

  logout() {
    localStorage.removeItem('user');
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
};

export const taskService = {
  async getTasks() {
    try {
      const response = await api.get('/tasks');
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      if (error.code === 'ERR_NETWORK') {
        return this.mockTasks();
      }
      throw error;
    }
  },

  async getTask(id) {
    try {
      const response = await api.get(`/tasks/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching task:', error);
      throw error;
    }
  },

  async createTask(task) {
    try {
      const response = await api.post('/tasks', task);
      return response.data;
    } catch (error) {
      console.error('Error creating task:', error);
      if (error.code === 'ERR_NETWORK') {
        const newTask = { ...task, id: Date.now() };
        alert('Задача создана локально (сервер не запущен)');
        return newTask;
      }
      throw error;
    }
  },

  async updateTask(id, task) {
    try {
      const response = await api.put(`/tasks/${id}`, task);
      return response.data;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  },

  async deleteTask(id) {
    try {
      const response = await api.delete(`/tasks/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  },

  async getUsers() {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      if (error.code === 'ERR_NETWORK') {
        return this.mockUsers();
      }
      throw error;
    }
  },

  async getUser(id) {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  async deleteUser(id) {
    try {
      const response = await api.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  mockTasks() {
    return [
      {
        id: 1,
        title: "Подготовить отчет",
        dueDate: "2024-01-20",
        priority: "high",
        assignedTo: 2,
        completed: false
      },
      {
        id: 2,
        title: "Проверить почту",
        dueDate: "2024-01-15",
        priority: "medium",
        assignedTo: 3,
        completed: true
      }
    ];
  },

  mockUsers() {
    return [
      { id: 1, username: 'admin', password: 'admin123', firstName: 'Алексей', lastName: 'Иванов', role: 'admin', createdAt: '2024-01-01T00:00:00.000Z' },
      { id: 2, username: 'user1', password: 'user123', firstName: 'Мария', lastName: 'Петрова', role: 'user', createdAt: '2024-01-01T00:00:00.000Z' },
      { id: 3, username: 'user2', password: 'user123', firstName: 'Иван', lastName: 'Сидоров', role: 'user', createdAt: '2024-01-01T00:00:00.000Z' }
    ];
  }
};

export const login = (username, password) => authService.login(username, password);
export const logout = () => authService.logout();
export const getCurrentUser = () => authService.getCurrentUser();
export const register = (userData) => authService.register(userData);

export const getTasks = () => taskService.getTasks();
export const getTask = (id) => taskService.getTask(id);
export const createTask = (task) => taskService.createTask(task);
export const updateTask = (id, task) => taskService.updateTask(id, task);
export const deleteTask = (id) => taskService.deleteTask(id);
export const getUsers = () => taskService.getUsers();
export const getUser = (id) => taskService.getUser(id);
export const deleteUser = (id) => taskService.deleteUser(id);