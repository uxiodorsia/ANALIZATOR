import React, { useState } from 'react';

const AdminUserActions = ({ user, onApprove, onRevoke, onDelete, onChangePassword }) => {
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  const handlePasswordChange = () => {
    if (newPassword.trim() === '') {
      alert('La nueva contraseña no puede estar vacía.');
      return;
    }
    onChangePassword(user.id, newPassword);
    setShowPasswordInput(false);
    setNewPassword('');
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex space-x-2 mb-2">
        {user.status === 'pending' && (
          <button
            onClick={() => onApprove(user.id)}
            className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-xs"
          >
            Aprobar
          </button>
        )}
        {user.status === 'active' && user.role !== 'admin' && (
          <button
            onClick={() => onRevoke(user.id)}
            className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-xs"
          >
            Revocar
          </button>
        )}
        {user.role !== 'admin' && (
          <button
            onClick={() => onDelete(user.id)}
            className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-xs"
          >
            Borrar
          </button>
        )}
        {user.role !== 'admin' && (
           <button
            onClick={() => setShowPasswordInput(!showPasswordInput)}
            className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-xs"
          >
            {showPasswordInput ? 'Cancelar' : 'Cambiar Contraseña'}
          </button>
        )}
      </div>
      {showPasswordInput && (
        <div className="flex space-x-2 mt-2">
          <input
            type="password"
            placeholder="Nueva contraseña"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="px-2 py-1 text-sm border border-gray-300 rounded-lg"
          />
          <button
            onClick={handlePasswordChange}
            className="px-3 py-1 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-xs"
          >
            Guardar
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminUserActions;