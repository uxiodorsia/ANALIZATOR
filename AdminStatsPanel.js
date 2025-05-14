import React from 'react';

const AdminStatsPanel = ({ users, analyses, onDownload }) => {
  // Calcular estadísticas
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const pendingUsers = users.filter(u => u.status === 'pending').length;
  const totalTokens = users.reduce((sum, user) => sum + user.tokensUsed, 0);
  const monthlyTokens = users.reduce((sum, user) => sum + user.monthlyTokensUsed, 0);
  const totalCost = users.reduce((sum, user) => sum + user.apiCost, 0);
  const monthlyCost = users.reduce((sum, user) => sum + (user.apiCost * 0.3), 0); // Suponiendo 30% del costo es del mes
  
  // Top usuarios por tokens usados
  const topUsers = [...users]
    .sort((a, b) => b.tokensUsed - a.tokensUsed)
    .slice(0, 5);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-2xl mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800">Estadísticas de Uso</h3>
        <button
          onClick={() => onDownload('stats')}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Descargar Reporte
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-gray-600 text-sm">Usuarios Totales</h4>
          <p className="text-2xl font-bold">{totalUsers}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-gray-600 text-sm">Usuarios Activos</h4>
          <p className="text-2xl font-bold">{activeUsers}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-gray-600 text-sm">Tokens Totales</h4>
          <p className="text-2xl font-bold">{totalTokens.toLocaleString()}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-gray-600 text-sm">Costo Total</h4>
          <p className="text-2xl font-bold">${totalCost.toFixed(2)}</p>
        </div>
      </div>

      <h4 className="text-lg font-semibold text-gray-800 mb-3">Top Usuarios por Consumo</h4>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6">Usuario</th>
              <th className="py-3 px-6">Tokens Usados</th>
              <th className="py-3 px-6">Costo</th>
              <th className="py-3 px-6">% del Total</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {topUsers.map(user => (
              <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6">{user.username}</td>
                <td className="py-3 px-6">{user.tokensUsed.toLocaleString()}</td>
                <td className="py-3 px-6">${user.apiCost.toFixed(2)}</td>
                <td className="py-3 px-6">{totalTokens > 0 ? ((user.tokensUsed / totalTokens) * 100).toFixed(1) : 0}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminStatsPanel;