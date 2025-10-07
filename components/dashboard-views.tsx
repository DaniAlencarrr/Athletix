"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { athleteData, coachData } from "@/data/dashboardData";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PerformanceChart } from "@/components/charts/performance-chart";
import { RevenueChart } from "@/components/charts/revenue-chart";

export const CoachDashboard = () => (
  <>
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Faturamento Total (Estimado)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-green-600">{coachData.totalRevenue}</div>
          <p className="text-sm text-muted-foreground">Soma dos últimos 6 meses</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Aulas Agendadas (Próximo Mês)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-yellow-600">{coachData.scheduledClasses}</div>
          <p className="text-sm text-muted-foreground">Total de aulas individuais/grupo</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Atletas Ativos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-indigo-600">{coachData.athletesCoached}</div>
          <p className="text-sm text-muted-foreground">Alunos com treinos recorrentes</p>
        </CardContent>
      </Card>
    </div>

    <Card className="md:col-span-3">
      <CardHeader>
        <CardTitle>Faturamento Mensal 💰</CardTitle>
      </CardHeader>
      <CardContent>
        <RevenueChart data={coachData.revenue} />
      </CardContent>
    </Card>
    
    <Card className="md:col-span-3">
      <CardHeader>
        <CardTitle>Próximos Treinamentos Agendados</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px]">Atleta</TableHead>
              <TableHead>Tipo de Treino</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="text-right">Hora</TableHead> 
            </TableRow>
          </TableHeader>
          <TableBody>
            {coachData.nextTrainings.slice(0, 5).map((t, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{t.athlete}</TableCell>
                <TableCell>{t.type}</TableCell>
                <TableCell>{new Date(t.date).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">{t.time}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </>
);

export const AthleteDashboard = () => (
  <>
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Última Métrica Chave</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-blue-600">{athleteData.latestMetric.value}</div>
          <p className="text-sm text-muted-foreground">{athleteData.latestMetric.unit} - {athleteData.latestMetric.description}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Próximo Agendamento 🗓️</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-semibold">{athleteData.nextClasses[0].topic}</p>
          <p className="text-sm text-muted-foreground">{new Date(athleteData.nextClasses[0].date).toLocaleDateString()} às {athleteData.nextClasses[0].time}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Foco de Melhoria 🎯</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-semibold text-red-500">{athleteData.improvementAreas[0]}</p>
          <p className="text-sm text-muted-foreground">Recomendação do Treinador</p>
        </CardContent>
      </Card>
    </div>

    <Card className="md:col-span-3">
      <CardHeader>
        <CardTitle>Retidimento Mensal (Fictício) 📊</CardTitle>
      </CardHeader>
      <CardContent>
        <PerformanceChart data={athleteData.performance} />
      </CardContent>
    </Card>
    
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Últimos Treinamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <TableCaption>Resumo dos últimos 5 treinos</TableCaption>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead className="w-[150px]">Tipo de Treino</TableHead>
                <TableHead className="text-right">Avaliação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {athleteData.lastTrainings.slice(0, 5).map((t, index) => (
                <TableRow key={index}>
                  <TableCell>{new Date(t.date).toLocaleDateString()}</TableCell>
                  <TableCell className="font-medium">{t.type}</TableCell>
                  <TableCell className="text-right text-yellow-600">{t.rating}/5</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Próximas Aulas</CardTitle>
        </CardHeader>
        <CardContent>
          <TableCaption>Próximas 5 aulas agendadas</TableCaption>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Hora</TableHead>
                <TableHead className="w-[150px]">Tópico</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {athleteData.nextClasses.slice(0, 5).map((c, index) => (
                <TableRow key={index}>
                  <TableCell>{new Date(c.date).toLocaleDateString()}</TableCell>
                  <TableCell>{c.time}</TableCell>
                  <TableCell className="font-medium">{c.topic}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  </>
);