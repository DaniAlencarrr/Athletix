// src/data/dashboardData.js (Exemplo de dados fictícios)

export const athleteData = {
  performance: [
    { name: 'Jan', Retidimento: 4000 },
    { name: 'Fev', Retidimento: 3000 },
    { name: 'Mar', Retidimento: 5000 },
    { name: 'Abr', Retidimento: 4500 },
    { name: 'Mai', Retidimento: 6000 },
    { name: 'Jun', Retidimento: 5500 },
  ],
  lastTrainings: [
    { date: '2025-06-28', type: 'Força Explosiva', duration: '60 min', rating: 5 },
    { date: '2025-06-25', type: 'Resistência Aeróbica', duration: '90 min', rating: 4 },
    { date: '2025-06-23', type: 'Técnico Tático', duration: '75 min', rating: 5 },
  ],
  nextClasses: [
    { date: '2025-07-02', time: '18:00', topic: 'Agilidade e Velocidade' },
    { date: '2025-07-04', time: '10:00', topic: 'Análise de Jogo' },
  ],
  improvementAreas: ['Velocidade de Reação', 'Defesa em Quadra'],
  latestMetric: { value: 7.8, unit: 'km/h', description: 'Velocidade Média (Último Treino)' },
};

export const coachData = {
  revenue: [
    { month: 'Jan', Faturado: 12000 },
    { month: 'Fev', Faturado: 15500 },
    { month: 'Mar', Faturado: 14000 },
    { month: 'Abr', Faturado: 18000 },
    { month: 'Mai', Faturado: 17500 },
    { month: 'Jun', Faturado: 20000 },
  ],
  totalRevenue: 'R$ 110.000,00',
  nextTrainings: [
    { date: '2025-07-01', time: '09:00', athlete: 'Ana Silva', type: 'Técnica Individual' },
    { date: '2025-07-01', time: '17:00', athlete: 'Time Beta', type: 'Treino Tático' },
    { date: '2025-07-02', time: '18:00', athlete: 'Pedro Souza', type: 'Agilidade' },
  ],
  scheduledClasses: 25,
  athletesCoached: 12,
};




