import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../services/api';

const Profile = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  if (!user) {
    navigate('/login');
    return null;
  }

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (passwordData.newPassword.length < 6) {
      alert('Пароль должен содержать минимум 6 символов');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Пароли не совпадают');
      return;
    }
    alert('Пароль успешно изменен!');
    setShowChangePassword(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  return (
    <div className="profile-container">
      <h1 className="form-title">Мой профиль</h1>
      
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {user.firstName[0]}{user.lastName[0]}
          </div>
          <div className="profile-info-main">
            <h2>{user.firstName} {user.lastName}</h2>
            <p className="profile-username">{user.username}</p>
          </div>
        </div>
        
        <div className="profile-details">
          <div className="profile-detail">
            <strong>Роль:</strong> {user.role === 'admin' ? 'Администратор' : 'Пользователь'}
          </div>
          <div className="profile-detail">
            <strong>Зарегистрирован:</strong> {new Date().toLocaleDateString('ru-RU')}
          </div>
        </div>
        
        <button
          onClick={() => setShowChangePassword(!showChangePassword)}
          className="change-password-btn"
        >
          {showChangePassword ? 'Отмена' : 'Изменить пароль'}
        </button>
      </div>
      
      {showChangePassword && (
        <div className="password-form">
          <h3>Изменение пароля</h3>
          <form onSubmit={handlePasswordChange}>
            <div className="form-group">
              <label className="form-label">Текущий пароль</label>
              <input
                type="password"
                className="form-input"
                value={passwordData.currentPassword}
                onChange={e => setPasswordData({...passwordData, currentPassword: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Новый пароль</label>
              <input
                type="password"
                className="form-input"
                value={passwordData.newPassword}
                onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Подтвердите пароль</label>
              <input
                type="password"
                className="form-input"
                value={passwordData.confirmPassword}
                onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                required
              />
            </div>
            
            <button
              type="submit"
              className="submit-btn"
            >
              Сохранить новый пароль
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Profile;