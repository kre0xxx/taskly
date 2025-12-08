import React, { useState, useEffect } from 'react';
import { getTasks, getUsers } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ user }) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    highPriorityTasks: 0,
    totalUsers: 0,
    adminUsers: 0,
    regularUsers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [tasks, users] = await Promise.all([getTasks(), getUsers()]);
      
      const completedTasks = tasks.filter(task => task.completed).length;
      const highPriorityTasks = tasks.filter(task => task.priority === 'high').length;
      const adminUsers = users.filter(user => user.role === 'admin').length;
      
      setStats({
        totalTasks: tasks.length,
        completedTasks,
        pendingTasks: tasks.length - completedTasks,
        highPriorityTasks,
        totalUsers: users.length,
        adminUsers,
        regularUsers: users.length - adminUsers
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="skeleton" style={{ height: '50px', width: '200px', marginBottom: '32px' }}></div>
        <div className="skeleton" style={{ height: '150px', marginBottom: '32px' }}></div>
        <div className="stats-grid">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="stat-card">
              <div className="skeleton" style={{ height: '20px', width: '100px', marginBottom: '12px' }}></div>
              <div className="skeleton" style={{ height: '40px', width: '80px', marginBottom: '8px' }}></div>
              <div className="skeleton" style={{ height: '16px', width: '120px' }}></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container fade-in">
      <h1 className="dashboard-title">Панель управления</h1>
      
      <div className="welcome-message slide-in-up">
        <h2>Добро пожаловать, {user.firstName} {user.lastName}! 👋</h2>
        <p>Сегодня: {new Date().toLocaleDateString('ru-RU', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}</p>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card tasks-total fade-in">
          <div className="stat-icon">📊</div>
          <h3>Всего задач</h3>
          <div className="stat-number">
            {stats.totalTasks}
          </div>
          <div className="stat-subtext">
            Активных: {stats.pendingTasks}
          </div>
        </div>
        
        <div className="stat-card tasks-completed fade-in delay-200">
          <div className="stat-icon">✅</div>
          <h3>Выполнено</h3>
          <div className="stat-number">
            {stats.completedTasks}
          </div>
          <div className="stat-subtext">
            {stats.totalTasks > 0 ? 
              `${Math.round((stats.completedTasks / stats.totalTasks) * 100)}% выполнено` : 
              'Нет задач'
            }
          </div>
        </div>
        
        <div className="stat-card tasks-pending fade-in delay-400">
          <div className="stat-icon">⚠️</div>
          <h3>Высокий приоритет</h3>
          <div className="stat-number">
            {stats.highPriorityTasks}
          </div>
          <div className="stat-subtext">
            Требуют внимания
          </div>
        </div>
        
        {user.role === 'admin' && (
          <div className="stat-card users-total fade-in delay-600">
            <div className="stat-icon">👥</div>
            <h3>Пользователей</h3>
            <div className="stat-number">
              {stats.totalUsers}
            </div>
            <div className="stat-subtext">
              {stats.adminUsers} админов, {stats.regularUsers} пользователей
            </div>
          </div>
        )}
      </div>
      
      <div className="quick-actions slide-in-up delay-800">
        <h3>Быстрые действия ⚡</h3>
        <div className="action-buttons">
          <button 
            onClick={() => navigate('/tasks')}
            className="action-btn primary"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Все задачи
          </button>
          
          <button 
            onClick={() => navigate('/tasks/new')}
            className="action-btn success"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Новая задача
          </button>
          
          {user.role === 'admin' && (
            <>
              <button 
                onClick={() => navigate('/users')}
                className="action-btn warning"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Пользователи
              </button>
              
              <button 
                onClick={() => navigate('/users/new')}
                className="action-btn info"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Новый пользователь
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;