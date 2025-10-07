export interface AthletePerformanceData {
    name: string; // O mês (Jan, Fev)
    Retidimento: number; // O valor da métrica
}

export interface CoachRevenueData {
    month: string; // O mês (Jan, Fev)
    Faturado: number; // O valor faturado
}

export interface ChartProps<T> {
    data: T[];
}