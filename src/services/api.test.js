jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  })),
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));


global.btoa = jest.fn((str) => `base64:${str}`);
global.alert = jest.fn();

const axios = require('axios');
const { 
  authService, 
  taskService,
  login, 
  logout, 
  getCurrentUser, 
  getTasks, 
  createTask,
  updateTask,
  deleteTask,
  getUsers,
  register,
  deleteUser
} = require('./api');


const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn(key => store[key]),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn(key => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    })
  };
})();

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
  writable: true
});

describe('API Service', () => {
  let mockApi;
  
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    global.alert.mockClear();
    

    mockApi = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
      interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() },
      },
    };
    
    axios.create.mockReturnValue(mockApi);
  });

  describe('Authentication', () => {
    describe('login', () => {
    });

    describe('mockLogin', () => {
      test('авторизует существующего пользователя из мок данных', () => {
        const result = authService.mockLogin('admin', 'admin123');
        
        expect(result).toHaveProperty('token');
        expect(result.username).toBe('admin');
        expect(result.firstName).toBe('Алексей');
        expect(localStorage.setItem).toHaveBeenCalledWith('user', expect.any(String));
      });

      test('выбрасывает ошибку при неверных учетных данных', () => {
        expect(() => authService.mockLogin('wrong', 'credentials'))
          .toThrow('Неверные учетные данные');
      });
    });

    test('logout очищает localStorage', () => {
      localStorage.setItem('user', JSON.stringify({ id: 1, username: 'test' }));
      
      authService.logout();
      
      expect(localStorage.removeItem).toHaveBeenCalledWith('user');
    });
    test('getCurrentUser возвращает null если пользователь не авторизован', () => {
      const user = authService.getCurrentUser();
      expect(user).toBeNull();
    });

    test('getCurrentUser возвращает null при невалидном JSON', () => {
      localStorage.setItem('user', 'invalid json');
      const user = authService.getCurrentUser();
      expect(user).toBeNull();
    });
  });
});