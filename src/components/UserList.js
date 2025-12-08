import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUsers, deleteUser, getCurrentUser } from '../services/api';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const usersData = await getUsers();
      setUsers(usersData);
    } catch (error) {
      console.error('Ошибка загрузки пользователей:', error);
      setError('Не удалось загрузить пользователей');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId, username) => {
    // Не позволяем удалить самого себя
    if (currentUser && currentUser.id === userId) {
      alert('Вы не можете удалить свой собственный аккаунт!');
      return;
    }

    if (username === 'admin') {
      alert('Нельзя удалить основного администратора!');
      return;
    }

    if (window.confirm(`Вы уверены, что хотите удалить пользователя ${username}?`)) {
      try {
        await deleteUser(userId);
        setUsers(users.filter(user => user.id !== userId));
        alert('Пользователь успешно удален');
      } catch (error) {
        console.error('Ошибка удаления пользователя:', error);
        alert('Ошибка при удалении пользователя');
      }
    }
  };

  const getInitials = (firstName, lastName) => {
    if (!firstName || !lastName) return '??';
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Неизвестно';
    try {
      return new Date(dateString).toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return 'Неизвестно';
    }
  };

  if (loading) {
    return (
      <div className="users-container">
        <div className="users-header">
          <h1 className="users-title">Пользователи системы</h1>
          <div className="skeleton" style={{ height: '40px', width: '180px' }}></div>
        </div>
        <div className="users-grid">
          {[1, 2, 3].map(i => (
            <div key={i} className="user-card">
              <div className="skeleton" style={{ 
                width: '80px', 
                height: '80px', 
                borderRadius: '50%',
                margin: '0 auto 20px'
              }}></div>
              <div className="skeleton" style={{ height: '24px', width: '150px', margin: '0 auto 8px' }}></div>
              <div className="skeleton" style={{ height: '20px', width: '120px', margin: '0 auto 12px' }}></div>
              <div className="skeleton" style={{ height: '16px', width: '100px', margin: '0 auto 8px' }}></div>
              <div className="skeleton" style={{ height: '32px', width: '100%', marginTop: '20px' }}></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="users-container">
      <div className="users-header">
        <h1 className="users-title">Пользователи системы</h1>
        <Link to="/users/new" className="add-btn">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Добавить пользователя
        </Link>
      </div>

      {error && (
        <div className="error-message" style={{ marginBottom: '1rem' }}>
          <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      <div className="users-grid">
        {users.length === 0 ? (
          <div className="no-users" style={{ 
            gridColumn: '1 / -1', 
            textAlign: 'center', 
            padding: '4rem',
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--border)',
            margin: '20px 0'
          }}>
            <div style={{ 
              fontSize: '4rem',
              marginBottom: '1rem',
              opacity: 0.5
            }}>
              👥
            </div>
            <h3 style={{ 
              color: 'var(--text-primary)', 
              marginBottom: '1rem',
              fontSize: '1.5rem'
            }}>
              Нет пользователей
            </h3>
            <p style={{ 
              color: 'var(--text-secondary)', 
              marginBottom: '2rem',
              fontSize: '1rem'
            }}>
              Добавьте первого пользователя в систему
            </p>
            <Link to="/users/new" className="add-btn" style={{ display: 'inline-flex' }}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Добавить первого пользователя
            </Link>
          </div>
        ) : (
          users.map((user, index) => (
            <div 
              key={user.id} 
              className="user-card"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="user-avatar">
                {getInitials(user.firstName, user.lastName)}
              </div>
              <h3 className="user-name">
                {user.firstName} {user.lastName}
              </h3>
              <p className="user-username">
                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {user.username}
              </p>
              <p className="user-date">
                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Создан: {formatDate(user.createdAt)}
              </p>
              <div className="user-role-container">
                <span className={`user-role ${user.role}`}>
                  {user.role === 'admin' ? 'Администратор' : 'Пользователь'}
                </span>
              </div>

              <div className="user-actions">
                {(currentUser && currentUser.id !== user.id && user.username !== 'admin') && (
                  <button
                    onClick={() => handleDelete(user.id, user.username)}
                    className="action-btn delete-btn"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Удалить
                  </button>
                )}
                {currentUser && currentUser.id === user.id && (
                  <div className="current-user-badge">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Это ваш аккаунт
                  </div>
                )}
                {user.username === 'admin' && (
                  <div className="admin-protected-badge">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Основной администратор
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserList;