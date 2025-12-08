import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Particles from './components/Particles';
import Login from './components/Login';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import UserList from './components/UserList';
import UserForm from './components/UserForm';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import Header from './components/Header';
import { getCurrentUser, logout } from './services/api';
import './styles/App.css';


function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  return (
    <Router>
      <div className="app">
        <Particles />
        {user && <Header user={user} onLogout={handleLogout} />}
        <div className="container">
          <Routes>
            <Route 
              path="/login" 
              element={
                user ? <Navigate to="/dashboard" /> : <Login setUser={setUser} />
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                user ? <Dashboard user={user} /> : <Navigate to="/login" />
              } 
            />
            <Route 
              path="/tasks" 
              element={
                user ? <TaskList user={user} /> : <Navigate to="/login" />
              } 
            />
            <Route 
              path="/tasks/new" 
              element={
                user && user.role === 'admin' ? 
                <TaskForm /> : <Navigate to="/tasks" />
              } 
            />
            <Route 
              path="/tasks/edit/:id" 
              element={
                user && user.role === 'admin' ? 
                <TaskForm /> : <Navigate to="/tasks" />
              } 
            />
            <Route 
              path="/users" 
              element={
                user && user.role === 'admin' ? 
                <UserList /> : <Navigate to="/tasks" />
              } 
            />
            <Route 
              path="/users/new" 
              element={
                user && user.role === 'admin' ? 
                <UserForm /> : <Navigate to="/tasks" />
              } 
            />
            <Route 
              path="/profile" 
              element={
                user ? <Profile /> : <Navigate to="/login" />
              } 
            />
            <Route 
              path="/" 
              element={
                user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
              } 
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;