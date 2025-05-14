import React, { useState, useEffect } from 'react';
import AuthLogin from './components/AuthLogin';
import AuthRegister from './components/AuthRegister';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import storage from './utils/storage';
import initialUsers from './mock/users';
import initialAnalyses from './mock/analyses';

const App = () => {
  const [currentPage, setCurrentPage] = useState('login'); // 'login', 'register', 'admin', 'user'
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Inicializar datos si no existen en localStorage
    if (!storage.getStorage('users')) {
      storage.setStorage('users', initialUsers);
    }
    if (!storage.getStorage('analyses')) {
      storage.setStorage('analyses', initialAnalyses);
    }

    const storedUser = storage.getStorage('currentUser');
    if (storedUser) {
      setCurrentUser(storedUser);
      if (storedUser.role === 'admin') {
        setCurrentPage('admin');
      } else if (storedUser.status === 'active') {
        setCurrentPage('user');
      } else {
        setCurrentPage('login'); // Si el usuario está pendiente o inactivo, vuelve al login
        storage.removeStorage('currentUser');
      }
    }
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    if (user.role === 'admin') {
      setCurrentPage('admin');
    } else {
      setCurrentPage('user');
    }
  };

  const handleLogout = () => {
    storage.removeStorage('currentUser');
    setCurrentUser(null);
    setCurrentPage('login');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <AuthLogin onLoginSuccess={handleLoginSuccess} onNavigateToRegister={() => setCurrentPage('register')} />;
      case 'register':
        return <AuthRegister onNavigateToLogin={() => setCurrentPage('login')} />;
      case 'admin':
        return currentUser?.role === 'admin' ? <AdminDashboard onLogout={handleLogout} /> : <AuthLogin onLoginSuccess={handleLoginSuccess} onNavigateToRegister={() => setCurrentPage('register')} />;
      case 'user':
        return currentUser?.role === 'user' && currentUser?.status === 'active' ? <UserDashboard onLogout={handleLogout} /> : <AuthLogin onLoginSuccess={handleLoginSuccess} onNavigateToRegister={() => setCurrentPage('register')} />;
      default:
        return <AuthLogin onLoginSuccess={handleLoginSuccess} onNavigateToRegister={() => setCurrentPage('register')} />;
    }
  };

  return (
    <div className="App">
      {renderPage()}
    </div>
  );
};

export default App;

// DONE