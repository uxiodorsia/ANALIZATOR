import React from 'react';

export const initialUsers = [
  { 
    id: 1, 
    username: 'admin', 
    password: 'Ucf135449@83', 
    role: 'admin', 
    status: 'active',
    registrationDate: '2023-01-01',
    tokensUsed: 0,
    monthlyTokensUsed: 0,
    apiCost: 0
  },
  { 
    id: 2, 
    username: 'user1', 
    password: 'user1password', 
    role: 'user', 
    status: 'pending',
    registrationDate: '2023-02-15',
    tokensUsed: 0,
    monthlyTokensUsed: 0,
    apiCost: 0
  },
  { 
    id: 3, 
    username: 'user2', 
    password: 'user2password', 
    role: 'user', 
    status: 'active',
    registrationDate: '2023-03-10',
    tokensUsed: 0,
    monthlyTokensUsed: 0,
    apiCost: 0
  },
];

export default initialUsers;