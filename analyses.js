import React from 'react';

export const initialAnalyses = [
  {
    id: 1,
    userId: 2,
    fileName: 'ventas_q1_2023.csv',
    uploadDate: '2023-04-01',
    type: 'Ventas',
    summary: 'Análisis de ventas del primer trimestre de 2023. Se observa un crecimiento del 15% respecto al trimestre anterior.',
    recommendations: ['Enfocarse en los productos con mayor margen de ganancia.', 'Considerar expandir la publicidad en redes sociales.'],
    tokensUsed: 1200,
    data: {
      headers: ['Producto', 'Ventas', 'Margen'],
      rows: [
        ['Producto A', 15000, 0.25],
        ['Producto B', 10000, 0.15],
        ['Producto C', 8000, 0.30],
      ],
      charts: [
        { type: 'bar', title: 'Ventas por Producto', labels: ['Producto A', 'Producto B', 'Producto C'], data: [15000, 10000, 8000] },
      ],
    },
  },
  {
    id: 2,
    userId: 3,
    fileName: 'gastos_mensuales_abril.xlsx',
    uploadDate: '2023-05-01',
    type: 'Gestión Económica',
    summary: 'Análisis de gastos del mes de abril. Los gastos operativos representan el 60% del total.',
    recommendations: ['Revisar los gastos operativos para identificar posibles ahorros.', 'Negociar mejores tarifas con proveedores.'],
    tokensUsed: 800,
    data: {
      headers: ['Categoría', 'Monto'],
      rows: [
        ['Operativos', 5000],
        ['Marketing', 2000],
        ['Personal', 3000],
      ],
      charts: [
        { type: 'pie', title: 'Distribución de Gastos', labels: ['Operativos', 'Marketing', 'Personal'], data: [5000, 2000, 3000] },
      ],
    },
  },
];

export default initialAnalyses;