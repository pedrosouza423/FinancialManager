'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const mockTransacoes = [
  { categoria: "Mercado", valor: 137.23 },
  { categoria: "Outros", valor: 250 },
  { categoria: "Casa", valor: 30 },
]

const cores = ["#3b82f6", "#ef4444", "#10b981"]

export default function Dashboard() {
  const total = mockTransacoes.reduce((acc, t) => acc + t.valor, 0)

  return (
    <div className="p-4 space-y-4 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold text-center">Total da Semana</h1>
      <p className={`text-center text-2xl font-semibold ${total > 0 ? 'text-green-600' : 'text-red-600'}`}>
        {total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
      </p>

      <Tabs defaultValue="semana" className="w-full">
        <TabsList className="grid grid-cols-5">
          <TabsTrigger value="dia">Dia</TabsTrigger>
          <TabsTrigger value="semana">Semana</TabsTrigger>
          <TabsTrigger value="mes">Mês</TabsTrigger>
          <TabsTrigger value="ano">Ano</TabsTrigger>
          <TabsTrigger value="periodo">Período</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <CardContent className="p-4">
          <h2 className="text-lg font-medium mb-4">Distribuição por categoria</h2>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockTransacoes}
                  dataKey="valor"
                  nameKey="categoria"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {mockTransacoes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={cores[index % cores.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `R$ ${value}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-2">
        {mockTransacoes.map((item, idx) => (
          <Card key={idx}>
            <CardContent className="flex justify-between p-4">
              <span>{item.categoria}</span>
              <span className="font-medium">
                {item.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="fixed bottom-6 right-6">
        <Button className="rounded-full px-6 py-4 text-xl" variant="default">
          +
        </Button>
      </div>
    </div>
  )
}
