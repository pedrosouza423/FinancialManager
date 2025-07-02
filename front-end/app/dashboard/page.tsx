'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
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
import api from "@/lib/api"

type Transacao = {
  valor: number
  categoria: string
  tipo: string
}

const cores = ["#3b82f6", "#ef4444", "#10b981", "#eab308", "#8b5cf6"]

export default function Dashboard() {
  const router = useRouter()
  const [transacoes, setTransacoes] = useState<Transacao[]>([])
  const [saldo, setSaldo] = useState(0)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    async function fetchData() {
      try {
        const [transacoesRes, saldoRes] = await Promise.all([
          api.post("", {
            query: `query {
              transacoes {
                valor
                categoria
                tipo
              }
            }`,
          }),
          api.post("", {
            query: `query {
              saldoUsuario
            }`,
          }),
        ])

        setTransacoes(transacoesRes.data.data.transacoes)
        setSaldo(saldoRes.data.data.saldoUsuario)
      } catch (err) {
        console.error("Erro ao buscar dados do dashboard:", err)
        router.push("/login")
      }
    }

    fetchData()
  }, [router])

  return (
    <div className="p-4 space-y-4 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold text-center">Total da Semana</h1>
      <p className={`text-center text-2xl font-semibold ${saldo > 0 ? "text-green-600" : "text-red-600"}`}>
        {saldo.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })}
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
                  data={transacoes}
                  dataKey="valor"
                  nameKey="categoria"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {transacoes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={cores[index % cores.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `R$ ${value}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-2">
        {transacoes.map((item, idx) => (
          <Card key={idx}>
            <CardContent className="flex justify-between p-4">
              <div>
                <span className="block font-medium">{item.categoria}</span>
                <span className="text-sm text-muted-foreground">{item.tipo === "entrada" ? "Receita" : "Despesa"}</span>
              </div>
              <span className={`font-semibold ${item.tipo === "entrada" ? "text-green-600" : "text-red-600"}`}>
                {item.valor.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
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
