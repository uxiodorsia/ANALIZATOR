import React from 'react';

const LayoutHeader = ({ title, onBack }) => {
  return (
    <header className="w-full bg-white shadow-md p-4 flex justify-between items-center">
      <div className="flex items-center">
        <img 
          src="https://4tsix0yujj.ufs.sh/f/2vMRHqOYUHc0qbPQICvUMgOfLW4S62w7etx01aYAN8bRycsz" 
          alt="Analizator Logo" 
          className="h-10 mr-4"
        />
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      </div>
      {onBack && (
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Volver Atrás
        </button>
      )}
    </header>
  );
};

export default LayoutHeader;

// DONE