import React, { useState } from 'react';
import storage from '../utils/storage';
import initialUsers from '../mock/users';

const AuthLogin = ({ onLoginSuccess, onNavigateToRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    const users = storage.getStorage('users') || initialUsers;
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
      if (user.status === 'active') {
        storage.setStorage('currentUser', user);
        onLoginSuccess(user);
      } else {
        setError('Tu cuenta está pendiente de aprobación por el administrador.');
      }
    } else {
      setError('Usuario o contraseña incorrectos.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-400 to-blue-500 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex justify-center mb-6">
          <img
            src="https://4tsix0yujj.ufs.sh/f/2vMRHqOYUHc0qbPQICvUMgOfLW4S62w7etx01aYAN8bRycsz"
            alt="Analizator Logo"
            className="h-12"
          />
        </div>
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Analizator by AIUX STUDIO</h2>
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mt-3 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mt-3 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition"
        />
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <button
          onClick={handleLogin}
          className="w-full mt-6 bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors shadow-md"
        >
          Iniciar Sesión
        </button>
        <button
          onClick={onNavigateToRegister}
          className="w-full mt-3 text-black py-2 rounded-lg hover:underline transition-colors"
        >
          ¿No tienes cuenta? Regístrate aquí
        </button>
        <p className="text-center text-gray-600 text-sm mt-6">
          Si tienes algún problema de acceso debes ponerte en contacto con: <a href="mailto:analizator@aiuxstudio.io" className="text-blue-600 hover:underline">analizator@aiuxstudio.io</a>
        </p>
      </div>
    </div>
  );
};

export default AuthLogin;