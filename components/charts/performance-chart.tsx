import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AthletePerformanceData, ChartProps } from '@/types/charts'; 


export const PerformanceChart = ({ data }: ChartProps<AthletePerformanceData>) => (
  <div className="h-[300px]">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip 
          // O formatter precisa ser tipado também se o Recharts não inferir corretamente
          formatter={(value: number) => [`${value} Pontos`, 'Retidimento']} 
        />
        <Line 
          type="monotone" 
          dataKey="Retidimento"
          stroke="#3b82f6" 
          strokeWidth={2} 
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);