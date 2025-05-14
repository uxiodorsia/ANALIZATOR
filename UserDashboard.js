import React, { useState, useEffect } from 'react';
import storage from '../utils/storage';
import initialAnalyses from '../mock/analyses';
import LayoutHeader from './LayoutHeader';

const UserDashboard = ({ onLogout }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [analyses, setAnalyses] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [view, setView] = useState('dashboard'); // 'dashboard', 'analysis', 'history'

  useEffect(() => {
    const user = storage.getStorage('currentUser');
    setCurrentUser(user);
    const allAnalyses = storage.getStorage('analyses') || initialAnalyses;
    setAnalyses(allAnalyses.filter(analysis => analysis.userId === user?.id));
  }, []);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUploadFile = () => {
    if (!selectedFile) {
      alert('Por favor, selecciona un archivo.');
      return;
    }

    // Simulación de análisis con IA
    const newAnalysis = {
      id: analyses.length + 1,
      userId: currentUser.id,
      fileName: selectedFile.name,
      uploadDate: new Date().toISOString().split('T')[0],
      type: 'Análisis Genérico', // Simulación de detección de tipo
      summary: 'Este es un resumen simulado del análisis del archivo.',
      recommendations: ['Recomendación simulada 1.', 'Recomendación simulada 2.'],
      data: { // Datos simulados para gráficos y tablas
        headers: ['Columna 1', 'Columna 2'],
        rows: [['Dato A', 100], ['Dato B', 200]],
        charts: [{ type: 'bar', title: 'Gráfico Simulador', labels: ['Dato A', 'Dato B'], data: [100, 200] }],
      },
    };

    const updatedAnalyses = [...analyses, newAnalysis];
    setAnalyses(updatedAnalyses);
    const allAnalyses = storage.getStorage('analyses') || initialAnalyses;
    storage.setStorage('analyses', [...allAnalyses.filter(a => a.userId !== currentUser.id), ...updatedAnalyses]);

    setCurrentAnalysis(newAnalysis);
    setView('analysis');
    setSelectedFile(null);
  };

  const handleViewAnalysis = (analysis) => {
    setCurrentAnalysis(analysis);
    setView('analysis');
  };

  const handleDeleteAnalysis = (analysisId) => {
    if (window.confirm('¿Estás seguro de que quieres borrar este análisis?')) {
      const updatedAnalyses = analyses.filter(analysis => analysis.id !== analysisId);
      setAnalyses(updatedAnalyses);
      const allAnalyses = storage.getStorage('analyses') || initialAnalyses;
      storage.setStorage('analyses', allAnalyses.filter(a => a.id !== analysisId));
      if (currentAnalysis?.id === analysisId) {
        setCurrentAnalysis(null);
        setView('dashboard');
      }
    }
  };

  const handleDownloadAnalysis = () => {
    if (!currentAnalysis) return;
    // Simulación de descarga de documento Word
    alert('Simulando descarga del análisis en documento Word.');
  };

  const renderDashboard = () => (
    <div className="bg-white p-6 rounded-2xl shadow-2xl mb-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Subir Archivo para Análisis</h3>
      <input
        type="file"
        accept=".csv, .xlsx"
        onChange={handleFileChange}
        className="w-full mt-3 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition"
      />
      <button
        onClick={handleUploadFile}
        disabled={!selectedFile}
        className={`w-full mt-4 py-2 rounded-lg shadow-md transition-colors ${selectedFile ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
      >
        Subir y Analizar Archivo
      </button>
    </div>
  );

  const renderAnalysis = () => (
    <div className="bg-white p-6 rounded-2xl shadow-2xl mb-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Análisis: {currentAnalysis?.fileName}</h3>
      <p className="text-gray-700 mb-4">Tipo detectado: {currentAnalysis?.type}</p>
      <p className="text-gray-700 mb-4">{currentAnalysis?.summary}</p>

      <h4 className="text-lg font-semibold text-gray-800 mb-3">Gráficos:</h4>
      {currentAnalysis?.data?.charts.map((chart, index) => (
        <div key={index} className="mb-4 p-4 border border-gray-200 rounded-lg">
          <h5 className="font-semibold mb-2">{chart.title}</h5>
          {/* Simulación de gráfico - En un proyecto real, usarías una librería */}
          <div className="w-full h-40 bg-gray-100 flex items-end justify-around p-2 rounded-lg">
            {chart.data.map((value, i) => (
              <div
                key={i}
                style={{ height: `${(value / Math.max(...chart.data)) * 80}%` }}
                className="w-8 bg-blue-500 rounded-t-md"
              ></div>
            ))}
          </div>
          <div className="flex justify-around text-xs text-gray-600 mt-1">
             {chart.labels.map((label, i) => <span key={i}>{label}</span>)}
          </div>
        </div>
      ))}

      <h4 className="text-lg font-semibold text-gray-800 mb-3">Datos:</h4>
      <div className="overflow-x-auto mb-4">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-600 uppercase text-sm leading-normal">
              {currentAnalysis?.data?.headers.map((header, index) => (
                <th key={index} className="py-3 px-6">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {currentAnalysis?.data?.rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b border-gray-200 hover:bg-gray-100">
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="py-3 px-6 whitespace-nowrap">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      <h4 className="text-lg font-semibold text-gray-800 mb-3">Recomendaciones:</h4>
      <ul className="list-disc list-inside text-gray-700 mb-4">
        {currentAnalysis?.recommendations.map((rec, index) => (
          <li key={index}>{rec}</li>
        ))}
      </ul>

      <button
        onClick={handleDownloadAnalysis}
        className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
      >
        Descargar Análisis (Word)
      </button>
    </div>
  );

  const renderHistory = () => (
    <div className="bg-white p-6 rounded-2xl shadow-2xl mb-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Historial de Análisis</h3>
      {analyses.length === 0 ? (
        <p className="text-gray-600">Aún no tienes análisis guardados.</p>
      ) : (
        <ul className="space-y-4">
          {analyses.map(analysis => (
            <li key={analysis.id} className="flex justify-between items-center p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div>
                <p className="font-semibold text-gray-800">{analysis.fileName}</p>
                <p className="text-sm text-gray-600">Subido el: {analysis.uploadDate}</p>
                <p className="text-sm text-gray-600">Tipo: {analysis.type}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleViewAnalysis(analysis)}
                  className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-xs"
                >
                  Ver Análisis
                </button>
                <button
                  onClick={() => handleDeleteAnalysis(analysis.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-xs"
                >
                  Borrar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-500 flex flex-col">
      <LayoutHeader
        title={`Dashboard de Usuario${currentUser ? `: ${currentUser.username}` : ''}`}
        onBack={view === 'dashboard' ? onLogout : () => setView('dashboard')}
      />
      <main className="flex-grow p-6">
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setView('dashboard')}
            className={`px-6 py-2 rounded-lg shadow-md transition-colors ${view === 'dashboard' ? 'bg-black text-white' : 'bg-white text-gray-800 hover:bg-gray-100'}`}
          >
            Subir Archivo
          </button>
          <button
            onClick={() => setView('history')}
            className={`px-6 py-2 rounded-lg shadow-md transition-colors ${view === 'history' ? 'bg-black text-white' : 'bg-white text-gray-800 hover:bg-gray-100'}`}
          >
            Historial
          </button>
        </div>

        {view === 'dashboard' && renderDashboard()}
        {view === 'analysis' && currentAnalysis && renderAnalysis()}
        {view === 'history' && renderHistory()}
      </main>
    </div>
  );
};

export default UserDashboard;

// DONE