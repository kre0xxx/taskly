import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, MemoryRouter, Routes, Route } from 'react-router-dom';
import TaskForm from './TaskForm';
import { createTask, updateTask, getTask, getUsers } from '../services/api';

jest.mock('../services/api', () => ({
  createTask: jest.fn(),
  updateTask: jest.fn(),
  getTask: jest.fn(),
  getUsers: jest.fn()
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => ({})
}));

const mockUsers = [
  { id: 1, firstName: 'John', lastName: 'Doe', role: 'user' },
  { id: 2, firstName: 'Jane', lastName: 'Smith', role: 'user' }
];

describe('TaskForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getUsers.mockResolvedValue(mockUsers);
  });

  test('рендерит форму создания задачи', async () => {
    render(
      <BrowserRouter>
        <TaskForm />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText(/создание новой задачи/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/название задачи/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/дата выполнения/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/приоритет/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/исполнитель/i)).toBeInTheDocument();
    });
  });

  test('валидация обязательных полей', async () => {
    createTask.mockResolvedValue({ id: 1 });
    
    render(
      <BrowserRouter>
        <TaskForm />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByLabelText(/исполнитель/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /создать/i }));
    
    expect(createTask).not.toHaveBeenCalled();
  });

  test('создание новой задачи', async () => {
    const newTask = {
      title: 'New Task',
      dueDate: '2024-01-31',
      priority: 'medium',
      assignedTo: '1',
      completed: false
    };
    
    createTask.mockResolvedValue({ ...newTask, id: 1 });
    
    render(
      <BrowserRouter>
        <TaskForm />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByLabelText(/исполнитель/i)).toBeInTheDocument();
    });
    
    fireEvent.change(screen.getByLabelText(/название задачи/i), {
      target: { value: newTask.title }
    });
    
    fireEvent.change(screen.getByLabelText(/дата выполнения/i), {
      target: { value: newTask.dueDate }
    });
    
    fireEvent.change(screen.getByLabelText(/приоритет/i), {
      target: { value: newTask.priority }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /создать/i }));
    
    await waitFor(() => {
      expect(createTask).toHaveBeenCalledWith(expect.objectContaining({
        title: newTask.title,
        dueDate: newTask.dueDate,
        priority: newTask.priority,
        assignedTo: parseInt(newTask.assignedTo)
      }));
      expect(mockNavigate).toHaveBeenCalledWith('/tasks');
    });
  });

  test('редактирование существующей задачи', async () => {
    const existingTask = {
      id: 1,
      title: 'Existing Task',
      dueDate: '2024-01-20',
      priority: 'high',
      assignedTo: 2,
      completed: false
    };
    
    jest.spyOn(require('react-router-dom'), 'useParams').mockReturnValue({ id: '1' });
    
    getTask.mockResolvedValue(existingTask);
    updateTask.mockResolvedValue(existingTask);
    
    render(
      <BrowserRouter>
        <TaskForm />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText(/редактирование задачи/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/название задачи/i).value).toBe(existingTask.title);
    });
    
    // Изменяем задачу
    fireEvent.change(screen.getByLabelText(/название задачи/i), {
      target: { value: 'Updated Task' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /обновить/i }));
    
    await waitFor(() => {
      expect(updateTask).toHaveBeenCalledWith('1', expect.objectContaining({
        title: 'Updated Task'
      }));
      expect(mockNavigate).toHaveBeenCalledWith('/tasks');
    });
  });
});