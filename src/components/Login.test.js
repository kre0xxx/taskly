import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from './Login';
import { login } from '../services/api';

jest.mock('../services/api', () => ({
  login: jest.fn()
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

const renderLogin = () => {
  return render(
    <BrowserRouter>
      <Login setUser={jest.fn()} />
    </BrowserRouter>
  );
};

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('отображает кнопки быстрого входа', () => {
    renderLogin();
    
    expect(screen.getByText(/быстрый вход/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /администратор/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /пользователь/i })).toBeInTheDocument();
  });

  
});