import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import TaskList from './TaskList';
import { getTasks, getUsers, updateTask, deleteTask } from '../services/api';

jest.mock('../services/api', () => ({
  getTasks: jest.fn(),
  getUsers: jest.fn(),
  updateTask: jest.fn(),
  deleteTask: jest.fn()
}));

jest.mock('../hooks/useScrollAnimation', () => () => ({
  current: null
}));

const mockUser = {
  id: 1,
  username: 'testuser',
  firstName: 'Test',
  lastName: 'User',
  role: 'user'
};

const mockTasks = [
  {
    id: 1,
    title: 'Test Task 1',
    dueDate: '2024-01-20',
    priority: 'high',
    assignedTo: 1,
    completed: false
  },
  {
    id: 2,
    title: 'Test Task 2',
    dueDate: '2024-01-15',
    priority: 'medium',
    assignedTo: 2,
    completed: true
  }
];

const mockUsers = [
  { id: 1, firstName: 'Test', lastName: 'User', role: 'user' },
  { id: 2, firstName: 'Another', lastName: 'User', role: 'user' }
];

const renderTaskList = (user = mockUser) => {
  return render(
    <BrowserRouter>
      <TaskList user={user} />
    </BrowserRouter>
  );
};

describe('TaskList Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    
   
    window.confirm = jest.fn(() => true);
    
    global.URL.createObjectURL = jest.fn();
    global.URL.revokeObjectURL = jest.fn();
  });

 

  test('отображает заголовок "Мои задачи" для обычного пользователя', async () => {
    getTasks.mockResolvedValue(mockTasks);
    getUsers.mockResolvedValue(mockUsers);
    
    renderTaskList();
    
    await waitFor(() => {
      expect(screen.getByText(/мои задачи/i)).toBeInTheDocument();
    });
  });

  test('отображает заголовок "Все задачи" для администратора', async () => {
    getTasks.mockResolvedValue(mockTasks);
    getUsers.mockResolvedValue(mockUsers);
    
    const adminUser = { ...mockUser, role: 'admin' };
    renderTaskList(adminUser);
    
    await waitFor(() => {
      expect(screen.getByText(/все задачи/i)).toBeInTheDocument();
    });
  });

  test('отображает сообщение когда нет задач', async () => {
    getTasks.mockResolvedValue([]);
    getUsers.mockResolvedValue(mockUsers);
    
    renderTaskList();
    
    await waitFor(() => {
      expect(screen.getByText(/нет задач для отображения/i)).toBeInTheDocument();
    });
  });

  test('показывает кнопку "Новая задача" только для администратора', async () => {
    getTasks.mockResolvedValue(mockTasks);
    getUsers.mockResolvedValue(mockUsers);
    
    // Для обычного пользователя
    renderTaskList();
    
    await waitFor(() => {
      expect(screen.queryByText(/новая задача/i)).not.toBeInTheDocument();
    });
    
    // Для администратора
    const adminUser = { ...mockUser, role: 'admin' };
    renderTaskList(adminUser);
    
    await waitFor(() => {
      expect(screen.getByText(/новая задача/i)).toBeInTheDocument();
    });
  });

  test('отображает кнопку экспорта в CSV только для администратора', async () => {
    getTasks.mockResolvedValue(mockTasks);
    getUsers.mockResolvedValue(mockUsers);
    
    // Для обычного пользователя
    renderTaskList();
    
    await waitFor(() => {
      expect(screen.queryByText(/экспорт в csv/i)).not.toBeInTheDocument();
    });
    
    // Для администратора
    const adminUser = { ...mockUser, role: 'admin' };
    renderTaskList(adminUser);
    
    await waitFor(() => {
      expect(screen.getByText(/экспорт в csv/i)).toBeInTheDocument();
    });
  });

  test('сброс фильтров работает', async () => {
    getTasks.mockResolvedValue(mockTasks);
    getUsers.mockResolvedValue(mockUsers);
    
    renderTaskList();
    
    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    });
    
    const searchInput = screen.getByPlaceholderText(/поиск по названию задачи/i);
    fireEvent.change(searchInput, { target: { value: 'Task 2' } });
    
    const resetButton = screen.getByText(/сбросить/i);
    fireEvent.click(resetButton);
    
    await waitFor(() => {
      expect(searchInput.value).toBe('');
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    });
  });

  test('клик по задаче открывает модальное окно', async () => {
    getTasks.mockResolvedValue(mockTasks);
    getUsers.mockResolvedValue(mockUsers);
    
    renderTaskList();
    
    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    });
    
    const taskCard = screen.getByText('Test Task 1').closest('.task-card');
    fireEvent.click(taskCard);
    
    await waitFor(() => {
      expect(screen.getByText('Дата выполнения:')).toBeInTheDocument();
    });
  });
});