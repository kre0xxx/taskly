import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createTask, updateTask, getTask, getUsers } from '../services/api';

const TaskForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    dueDate: '',
    priority: 'medium',
    assignedTo: '',
    completed: false
  });

  const [taskLoading, setTaskLoading] = useState(false);

  useEffect(() => {
    loadUsers();
    
    if (id) {
      loadTask();
    }
  }, [id]);

  useEffect(() => {
    if (users.length > 0 && !id && !formData.assignedTo) {
      const firstUser = users.find(user => user.role === 'user');
      if (firstUser) {
        setFormData(prev => ({
          ...prev,
          assignedTo: firstUser.id
        }));
      }
    }
  }, [users, id, formData.assignedTo]);

  const loadUsers = async () => {
    try {
      const usersData = await getUsers();
      const filteredUsers = usersData.filter(user => user.role === 'user');
      setUsers(filteredUsers);
      
      if (filteredUsers.length > 0 && !id && !formData.assignedTo) {
        setFormData(prev => ({
          ...prev,
          assignedTo: filteredUsers[0].id
        }));
      }
    } catch (error) {
      console.error('Ошибка загрузки пользователей:', error);
    }
  };

  const loadTask = async () => {
    if (!id) return;
    
    setTaskLoading(true);
    try {
      const task = await getTask(id);
      setFormData({
        title: task.title || '',
        dueDate: task.dueDate || '',
        priority: task.priority || 'medium',
        assignedTo: task.assignedTo || '',
        completed: task.completed || false
      });
    } catch (error) {
      console.error('Ошибка загрузки задачи:', error);
      alert('Не удалось загрузить задачу');
    } finally {
      setTaskLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Валидация
    if (!formData.title.trim()) {
      alert('Введите название задачи');
      return;
    }
    
    if (!formData.dueDate) {
      alert('Выберите дату выполнения');
      return;
    }
    
    if (!formData.assignedTo) {
      alert('Выберите исполнителя');
      return;
    }
    
    setLoading(true);

    try {
      if (id) {
        await updateTask(id, formData);
      } else {
        await createTask(formData);
      }
      navigate('/tasks');
    } catch (error) {
      console.error('Ошибка сохранения задачи:', error);
      alert('Ошибка сохранения задачи');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleCancel = () => {
    navigate('/tasks');
  };

  if (taskLoading) {
    return (
      <div className="form-container">
        <div className="loading">Загрузка задачи...</div>
      </div>
    );
  }

  return (
    <div className="form-container">
      <h1 className="form-title">
        {id ? 'Редактирование задачи' : 'Создание новой задачи'}
      </h1>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title" className="form-label">
            Название задачи
          </label>
          <input
            id="title"
            type="text"
            name="title"
            className="form-input"
            value={formData.title}
            onChange={handleInputChange}
            required
            placeholder="Введите название задачи"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="dueDate" className="form-label">
            Дата выполнения
          </label>
          <input
            id="dueDate"
            type="date"
            name="dueDate"
            className="form-input"
            value={formData.dueDate}
            onChange={handleInputChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="priority" className="form-label">
            Приоритет
          </label>
          <select
            id="priority"
            name="priority"
            className="form-input"
            value={formData.priority}
            onChange={handleInputChange}
            required
            disabled={loading}
          >
            <option value="low">Низкий</option>
            <option value="medium">Средний</option>
            <option value="high">Высокий</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="assignedTo" className="form-label">
            Исполнитель
          </label>
          <select
            id="assignedTo"
            name="assignedTo"
            className="form-input"
            value={formData.assignedTo}
            onChange={handleInputChange}
            required
            disabled={loading || users.length === 0}
          >
            <option value="">Выберите исполнителя</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.firstName} {user.lastName}
              </option>
            ))}
          </select>
        </div>

        {id && (
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                name="completed"
                checked={formData.completed}
                onChange={handleInputChange}
                disabled={loading}
              />
              Задача выполнена
            </label>
          </div>
        )}

        <div className="form-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={handleCancel}
            disabled={loading}
          >
            Отмена
          </button>
          <button
            type="submit"
            className="submit-btn"
            disabled={loading || taskLoading || (users.length === 0 && !id)}
          >
            {loading ? 'Сохранение...' : id ? 'Обновить' : 'Создать'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;