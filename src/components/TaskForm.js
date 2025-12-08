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

  useEffect(() => {
    loadUsers();
    if (id) {
      loadTask();
    }
  }, [id]);

  const loadUsers = async () => {
    try {
      const usersData = await getUsers();
      setUsers(usersData.filter(user => user.role === 'user'));
      if (usersData.length > 0 && !id) {
        setFormData(prev => ({
          ...prev,
          assignedTo: usersData.find(u => u.role === 'user')?.id || ''
        }));
      }
    } catch (error) {
      console.error('Ошибка загрузки пользователей:', error);
    }
  };

  const loadTask = async () => {
    try {
      const task = await getTask(id);
      setFormData({
        title: task.title,
        dueDate: task.dueDate,
        priority: task.priority,
        assignedTo: task.assignedTo,
        completed: task.completed
      });
    } catch (error) {
      console.error('Ошибка загрузки задачи:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="form-container">
      <h1 className="form-title">
        {id ? 'Редактирование задачи' : 'Создание новой задачи'}
      </h1>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Название задачи</label>
          <input
            type="text"
            name="title"
            className="form-input"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Введите название задачи"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Дата выполнения</label>
          <input
            type="date"
            name="dueDate"
            className="form-input"
            value={formData.dueDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Приоритет</label>
          <select
            name="priority"
            className="form-input"
            value={formData.priority}
            onChange={handleChange}
            required
          >
            <option value="low">Низкий</option>
            <option value="medium">Средний</option>
            <option value="high">Высокий</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Исполнитель</label>
          <select
            name="assignedTo"
            className="form-input"
            value={formData.assignedTo}
            onChange={handleChange}
            required
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
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  completed: e.target.checked
                }))}
              />
              Задача выполнена
            </label>
          </div>
        )}

        <div className="form-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate('/tasks')}
            disabled={loading}
          >
            Отмена
          </button>
          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Сохранение...' : id ? 'Обновить' : 'Создать'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;