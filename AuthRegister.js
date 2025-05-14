import React, { useState } from 'react';
import storage from '../utils/storage';
import initialUsers from '../mock/users';

const AuthRegister = ({ onNavigateToLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = () => {
    const users = storage.getStorage('users') || initialUsers;
    const newUser = {
      id: users.length + 1,
      username,
      password,
      role: 'user',
      status: 'pending',
    };
    storage.setStorage('users', [...users, newUser]);
    setMessage('Registro exitoso. Tu cuenta está pendiente de aprobación por el administrador.');
    setUsername('');
    setPassword('');
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
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Registro</h2>
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
        <button
          onClick={handleRegister}
          className="w-full mt-6 bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors shadow-md"
        >
          Registrarse
        </button>
        {message && <p className="text-green-600 text-sm mt-4 text-center">{message}</p>}
        <button
          onClick={onNavigateToLogin}
          className="w-full mt-3 text-black py-2 rounded-lg hover:underline transition-colors"
        >
          ¿Ya tienes cuenta? Inicia Sesión
        </button>
        <p className="text-center text-gray-600 text-sm mt-6">
          Si tienes algún problema de acceso debes ponerte en contacto con: <a href="mailto:analizator@aiuxstudio.io" className="text-blue-600 hover:underline">analizator@aiuxstudio.io</a>
        </p>
      </div>
    </div>
  );
};

export default AuthRegister;

// DONE