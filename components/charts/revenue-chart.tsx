import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CoachRevenueData, ChartProps } from '@/types/charts';

export const RevenueChart = ({ data }: ChartProps<CoachRevenueData>) => (
  <div className="h-[300px]">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis tickFormatter={(value: number) => `R$${value/1000}k`} />
        <Tooltip 
        
          formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Faturamento']} 
        />
        <Bar 
          dataKey="Faturado"
          fill="#10b981"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  </div>
);