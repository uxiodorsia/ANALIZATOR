import React, { useState, useEffect } from 'react';
import storage from '../utils/storage';
import initialUsers from '../mock/users';
import initialAnalyses from '../mock/analyses';
import LayoutHeader from './LayoutHeader';
import AdminUserActions from './AdminUserActions';
import AdminStatsPanel from './AdminStatsPanel';

const AdminDashboard = ({ onLogout }) => {
  const [users, setUsers] = useState([]);
  const [analyses, setAnalyses] = useState([]);
  const [apiKey, setApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt-3.5-turbo');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  // Precios por modelo (por 1000 tokens)
  const modelPrices = {
    'gpt-3.5-turbo': 0.002,
    'gpt-4': 0.03,
    'gpt-4-turbo': 0.01
  };

  useEffect(() => {
    const storedUsers = storage.getStorage('users') || initialUsers;
    const storedAnalyses = storage.getStorage('analyses') || initialAnalyses;
    
    // Calcular tokens y costos para cada usuario
    const updatedUsers = storedUsers.map(user => {
      const userAnalyses = storedAnalyses.filter(a => a.userId === user.id);
      const tokensUsed = userAnalyses.reduce((sum, analysis) => sum + (analysis.tokensUsed || 0), 0);
      const monthlyTokensUsed = userAnalyses
        .filter(a => new Date(a.uploadDate) > new Date(new Date().setMonth(new Date().getMonth() - 1)))
        .reduce((sum, analysis) => sum + (analysis.tokensUsed || 0), 0);
      
      return {
        ...user,
        tokensUsed,
        monthlyTokensUsed,
        apiCost: tokensUsed * (modelPrices[selectedModel] / 1000)
      };
    });

    setUsers(updatedUsers);
    setAnalyses(storedAnalyses);
    setApiKey(storage.getStorage('openaiApiKey') || '');
    setSelectedModel(storage.getStorage('openaiModel') || 'gpt-3.5-turbo');
    setCurrentUser(storage.getStorage('currentUser'));
  }, [selectedModel]);

  const handleApproveUser = (userId) => {
    const updatedUsers = users.map(user =>
      user.id === userId ? { ...user, status: 'active' } : user
    );
    setUsers(updatedUsers);
    storage.setStorage('users', updatedUsers);
  };

  const handleRevokeUser = (userId) => {
    const updatedUsers = users.map(user =>
      user.id === userId ? { ...user, status: 'inactive' } : user
    );
    setUsers(updatedUsers);
    storage.setStorage('users', updatedUsers);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('¿Estás seguro de que quieres borrar este usuario? Esta acción es irreversible.')) {
      const updatedUsers = users.filter(user => user.id !== userId);
      setUsers(updatedUsers);
      storage.setStorage('users', updatedUsers);
      
      const allAnalyses = storage.getStorage('analyses') || [];
      const updatedAnalyses = allAnalyses.filter(analysis => analysis.userId !== userId);
      storage.setStorage('analyses', updatedAnalyses);
      setAnalyses(updatedAnalyses);
    }
  };

  const handleChangeUserPassword = (userId, newPassword) => {
    const updatedUsers = users.map(user =>
      user.id === userId ? { ...user, password: newPassword } : user
    );
    setUsers(updatedUsers);
    storage.setStorage('users', updatedUsers);
    alert(`Contraseña del usuario con ID ${userId} cambiada con éxito.`);
  };

  const handleSaveApiKey = () => {
    storage.setStorage('openaiApiKey', apiKey);
    storage.setStorage('openaiModel', selectedModel);
    alert('Configuración guardada.');
  };

  const handleDownload = (type) => {
    // Simulación de descarga de reporte
    let data = [];
    let filename = '';
    
    if (type === 'stats') {
      data = users.map(user => ({
        Usuario: user.username,
        Estado: user.status,
        'Fecha Registro': user.registrationDate,
        'Tokens Totales': user.tokensUsed,
        'Tokens Mes Actual': user.monthlyTokensUsed,
        'Costo Total': `$${user.apiCost.toFixed(2)}`,
        'Costo Mes Actual': `$${(user.apiCost * 0.3).toFixed(2)}`
      }));
      filename = 'estadisticas_usuarios.csv';
    } else if (type === 'users') {
      data = users.map(user => ({
        ID: user.id,
        Usuario: user.username,
        Rol: user.role,
        Estado: user.status,
        'Fecha Registro': user.registrationDate,
        'Tokens Usados': user.tokensUsed,
        'Tokens Mes': user.monthlyTokensUsed,
        'Costo Total': `$${user.apiCost.toFixed(2)}`
      }));
      filename = 'lista_usuarios.csv';
    }
    
    alert(`Simulando descarga de ${filename}`);
  };

  const handleChangeAdminPassword = () => {
    if (newPassword.trim() === '') {
      alert('La nueva contraseña no puede estar vacía.');
      return;
    }
    
    const updatedUsers = users.map(user =>
      user.id === currentUser.id ? { ...user, password: newPassword } : user
    );
    
    setUsers(updatedUsers);
    storage.setStorage('users', updatedUsers);
    storage.setStorage('currentUser', { ...currentUser, password: newPassword });
    setShowChangePassword(false);
    setNewPassword('');
    alert('Contraseña cambiada con éxito.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-500 flex flex-col">
      <LayoutHeader title="Dashboard de Administrador" onBack={onLogout} />
      <main className="flex-grow p-6">
        <AdminStatsPanel users={users} analyses={analyses} onDownload={handleDownload} />
        
        <div className="bg-white p-6 rounded-2xl shadow-2xl mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Gestión de Usuarios</h3>
            <button
              onClick={() => handleDownload('users')}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Descargar Lista
            </button>
          </div>
          
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-100 text-left text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6">Usuario</th>
                <th className="py-3 px-6">Estado</th>
                <th className="py-3 px-6">Fecha Registro</th>
                <th className="py-3 px-6">Tokens Totales</th>
                <th className="py-3 px-6">Tokens Mes</th>
                <th className="py-3 px-6">Costo Total</th>
                <th className="py-3 px-6 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {users.map(user => (
                <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left whitespace-nowrap">{user.username}</td>
                  <td className="py-3 px-6 text-left">
                    <span className={`py-1 px-3 rounded-full text-xs ${user.status === 'active' ? 'bg-green-200 text-green-600' : user.status === 'pending' ? 'bg-yellow-200 text-yellow-600' : 'bg-red-200 text-red-600'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3 px-6">{user.registrationDate}</td>
                  <td className="py-3 px-6">{user.tokensUsed.toLocaleString()}</td>
                  <td className="py-3 px-6">{user.monthlyTokensUsed.toLocaleString()}</td>
                  <td className="py-3 px-6">${user.apiCost.toFixed(2)}</td>
                  <td className="py-3 px-6 text-center">
                    <AdminUserActions
                      user={user}
                      onApprove={handleApproveUser}
                      onRevoke={handleRevokeUser}
                      onDelete={handleDeleteUser}
                      onChangePassword={handleChangeUserPassword}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-2xl">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Configuración de OpenAI</h3>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">API Key</label>
            <input
              type="text"
              placeholder="Ingresa tu API Key de OpenAI"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Modelo</label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition"
            >
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo ($0.002/1K tokens)</option>
              <option value="gpt-4">GPT-4 ($0.03/1K tokens)</option>
              <option value="gpt-4-turbo">GPT-4 Turbo ($0.01/1K tokens)</option>
            </select>
          </div>
          
          <button
            onClick={handleSaveApiKey}
            className="w-full mt-4 bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors shadow-md"
          >
            Guardar Configuración
          </button>
          
          {currentUser && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Cambiar Mi Contraseña</h4>
              
              {!showChangePassword ? (
                <button
                  onClick={() => setShowChangePassword(true)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Cambiar Contraseña
                </button>
              ) : (
                <div className="flex items-center space-x-2">
                  <input
                    type="password"
                    placeholder="Nueva contraseña"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition"
                  />
                  <button
                    onClick={handleChangeAdminPassword}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={() => setShowChangePassword(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;

// DONE