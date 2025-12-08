import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getTasks, deleteTask, updateTask, getUsers } from '../services/api';
import useScrollAnimation from '../hooks/useScrollAnimation';

const TaskList = ({ user }) => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [selectedTask, setSelectedTask] = useState(null);
  const navigate = useNavigate();
  const taskGridRef = useScrollAnimation();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [tasksData, usersData] = await Promise.all([
        getTasks(),
        getUsers()
      ]);
      setTasks(tasksData);
      setUsers(usersData);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить эту задачу?')) {
      try {
        await deleteTask(id);
        setTasks(tasks.filter(task => task.id !== id));
      } catch (error) {
        console.error('Ошибка удаления задачи:', error);
      }
    }
  };

  const handleComplete = async (task) => {
    try {
      const updatedTask = { ...task, completed: !task.completed };
      await updateTask(task.id, updatedTask);
      setTasks(tasks.map(t => t.id === task.id ? updatedTask : t));
    } catch (error) {
      console.error('Ошибка обновления задачи:', error);
    }
  };

  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? `${user.firstName} ${user.lastName}` : 'Неизвестный';
  };

  const getPriorityText = (priority) => {
    const texts = {
      high: 'Высокий',
      medium: 'Средний',
      low: 'Низкий'
    };
    return texts[priority] || priority;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  const exportToCSV = () => {
    const headers = ['Название', 'Дата выполнения', 'Приоритет', 'Исполнитель', 'Статус'];
    const csvData = [
      headers.join(','),
      ...filteredTasks.map(task => [
        `"${task.title}"`,
        task.dueDate,
        getPriorityText(task.priority),
        getUserName(task.assignedTo),
        task.completed ? 'Выполнена' : 'В работе'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tasks_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Фильтрация задач
  const userTasks = user.role === 'admin' 
    ? tasks 
    : tasks.filter(task => task.assignedTo === user.id);

  const filteredTasks = userTasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'completed' && task.completed) ||
      (filterStatus === 'active' && !task.completed);
    
    return matchesSearch && matchesPriority && matchesStatus;
  });

  // Сортировка задач
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch(sortBy) {
      case 'date':
        return new Date(a.dueDate) - new Date(b.dueDate);
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      case 'title':
        return a.title.localeCompare(b.title);
      case 'status':
        return (a.completed === b.completed) ? 0 : a.completed ? 1 : -1;
      default:
        return 0;
    }
  });

  if (loading) {
    return <div className="loading">Загрузка задач...</div>;
  }

  return (
    <div className="tasks-container">
      <div className="tasks-header">
        <h1 className="tasks-title">
          {user.role === 'admin' ? 'Все задачи' : 'Мои задачи'}
        </h1>
        <div className="tasks-actions">
          {user.role === 'admin' && (
            <button
              onClick={exportToCSV}
              className="export-btn"
            >
              📊 Экспорт в CSV
            </button>
          )}
          {user.role === 'admin' && (
            <Link to="/tasks/new" className="add-btn">
              <span>+</span> Новая задача
            </Link>
          )}
        </div>
      </div>

      {/* Фильтры и поиск */}
      <div className="filters-container">
        <div className="search-box">
          <input
            type="text"
            placeholder="Поиск по названию задачи..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-group">
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="filter-select"
          >
            <option value="all">Все приоритеты</option>
            <option value="high">Высокий</option>
            <option value="medium">Средний</option>
            <option value="low">Низкий</option>
          </select>
        </div>
        
        <div className="filter-group">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">Все статусы</option>
            <option value="completed">Выполненные</option>
            <option value="active">Активные</option>
          </select>
        </div>

        <div className="filter-group">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="date">По дате</option>
            <option value="priority">По приоритету</option>
            <option value="title">По названию</option>
            <option value="status">По статусу</option>
          </select>
        </div>
        
        <button
          onClick={() => {
            setSearchTerm('');
            setFilterPriority('all');
            setFilterStatus('all');
            setSortBy('date');
          }}
          className="reset-btn"
        >
          Сбросить
        </button>
      </div>

      {/* Список задач */}
      <div className="tasks-grid" ref={taskGridRef}>
        {sortedTasks.length === 0 ? (
          <div className="no-tasks">
            <p>Нет задач для отображения</p>
            {user.role === 'admin' && (
              <Link to="/tasks/new" className="add-btn">
                Создать первую задачу
              </Link>
            )}
          </div>
        ) : (
          sortedTasks.map(task => (
            <div 
              key={task.id} 
              className={`task-card ${task.priority} scroll-reveal`}
              onClick={() => setSelectedTask(task)}
            >
              <div className="task-header">
                <h3 className="task-title">{task.title}</h3>
                <span className={`priority-badge ${task.priority}`}>
                  {getPriorityText(task.priority)}
                </span>
              </div>
              
              <div className="task-details">
                <div className="task-date">
                  <span>📅</span>
                  <span>Срок: {formatDate(task.dueDate)}</span>
                </div>
                <div className="task-assigned">
                  <span>👤</span>
                  <span>Исполнитель: {getUserName(task.assignedTo)}</span>
                </div>
                <div className="task-status">
                  <span>Статус: </span>
                  <span className={task.completed ? 'completed' : 'pending'}>
                    {task.completed ? 'Выполнена' : 'В работе'}
                  </span>
                </div>
              </div>

              <div className="task-actions" onClick={e => e.stopPropagation()}>
                {user.role === 'admin' ? (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/tasks/edit/${task.id}`);
                      }}
                      className="action-btn edit-btn"
                    >
                      Редактировать
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(task.id);
                      }}
                      className="action-btn delete-btn"
                    >
                      Удалить
                    </button>
                  </>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleComplete(task);
                    }}
                    className="action-btn complete-btn"
                  >
                    {task.completed ? 'Возобновить' : 'Завершить'}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Модальное окно просмотра задачи */}
      {selectedTask && (
        <div className="modal-overlay" onClick={() => setSelectedTask(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>{selectedTask.title}</h2>
            <div className="modal-details">
              <p><strong>Дата выполнения:</strong> {formatDate(selectedTask.dueDate)}</p>
              <p><strong>Приоритет:</strong> {getPriorityText(selectedTask.priority)}</p>
              <p><strong>Исполнитель:</strong> {getUserName(selectedTask.assignedTo)}</p>
              <p><strong>Статус:</strong> {selectedTask.completed ? '✅ Выполнена' : '🔄 В работе'}</p>
            </div>
            <div className="modal-actions">
              {user.role === 'admin' && (
                <button
                  onClick={() => navigate(`/tasks/edit/${selectedTask.id}`)}
                  className="action-btn edit-btn"
                >
                  Редактировать
                </button>
              )}
              <button
                onClick={() => setSelectedTask(null)}
                className="action-btn close-btn"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;