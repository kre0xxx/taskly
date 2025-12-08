import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';

const Login = ({ setUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(username, password);
      setUser(user);
      navigate('/dashboard');
    } catch (err) {
      setError('Неверный логин или пароль');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (user, pass) => {
    setUsername(user);
    setPassword(pass);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="text-center mb-10">
          <div className="logo text-3xl mb-2">
            <span className="text-gradient">Taskly</span>
          </div>
          <p className="text-secondary"></p>
        </div>

        <h2 className="login-title">Добро пожаловать</h2>
        <p className="text-center text-secondary mb-8">Войдите в свой аккаунт</p>

        {error && (
          <div className="notification error mb-6">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Логин</label>
            <div className="relative">
              <input
                type="text"
                className="form-input pl-12"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Введите логин"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Пароль</label>
            <div className="relative">
              <input
                type="password"
                className="form-input pl-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Введите пароль"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            className="login-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Вход...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Войти
              </>
            )}
          </button>
        </form>

        <div className="quick-login mt-8">
          <p className="text-center text-secondary mb-4">Быстрый вход для тестирования:</p>
          <div className="quick-buttons">
            <button 
              type="button" 
              onClick={() => handleQuickLogin('admin', 'admin123')}
              className="quick-btn"
            >
              👑 Администратор
            </button>
            <button 
              type="button" 
              onClick={() => handleQuickLogin('user1', 'user123')}
              className="quick-btn"
            >
              👤 Пользователь
            </button>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-center text-xs text-muted">
            <code className="block mt-2 bg-input px-3 py-1 rounded text-xs font-mono">
            </code>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;