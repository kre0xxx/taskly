import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getTasks } from '../services/api';

const Header = ({ user, onLogout }) => {
  const [overdueCount, setOverdueCount] = useState(0);
  const location = useLocation();

  useEffect(() => {
    if (user) {
      loadOverdueTasks();
    }
  }, [user]);

  const loadOverdueTasks = async () => {
    try {
      const tasks = await getTasks();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const overdue = tasks.filter(task => {
        if (task.completed) return false;
        if (!task.dueDate) return false;
        
        const dueDate = new Date(task.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        
        return dueDate < today;
      });
      
      setOverdueCount(overdue.length);
    } catch (error) {
      console.error('Error loading overdue tasks:', error);
    }
  };

  const isActive = (path) => {
    if (path === '/dashboard' && location.pathname === '/') return true;
    return location.pathname.startsWith(path);
  };

  return (
    <header className="header">
      <nav className="nav">
        <div className="logo">
          <span className="text-gradient">Taskly</span>
        </div>
        
        <div className="nav-links">
          <Link 
            to="/dashboard" 
            className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Главная
          </Link>
          
          <Link 
            to="/tasks" 
            className={`nav-link ${isActive('/tasks') ? 'active' : ''}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Задачи
            {overdueCount > 0 && (
              <span className="badge pulse">
                {overdueCount}
              </span>
            )}
          </Link>
          
          {user.role === 'admin' && (
            <>
              <Link 
                to="/tasks/new" 
                className={`nav-link ${isActive('/tasks/new') ? 'active' : ''}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Создать задачу
              </Link>
              
              <Link 
                to="/users" 
                className={`nav-link ${isActive('/users') ? 'active' : ''}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Пользователи
              </Link>
              
              <Link 
                to="/users/new" 
                className={`nav-link ${isActive('/users/new') ? 'active' : ''}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Добавить пользователя
              </Link>
            </>
          )}
        </div>
        
        <div className="user-info">
          <Link to="/profile" className="user-profile hover-lift">
            <div className="user-avatar">
              {user.firstName[0]}{user.lastName[0]}
            </div>
            <div className="user-details">
              <div className="user-name">
                {user.firstName} {user.lastName}
              </div>
              <span className="user-role-badge">
                {user.role === 'admin' ? 'Админ' : 'Пользователь'}
              </span>
            </div>
          </Link>
          
          <button onClick={onLogout} className="logout-btn hover-lift">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Выйти
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;