'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { login } from "../../lib/auth"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [erro, setErro] = useState("")
  const router = useRouter()

  async function handleLogin() {
    try {
      await login(email, senha)
      router.push("/dashboard")
    } catch {
      setErro("Email ou senha inválidos")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-lg max-w-sm shadow-lg border border-white/10 bg-white/5 backdrop-blur-lg rounded-xl">
        <CardHeader>
          <CardTitle className="text-center text-lg">Login</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          {erro && <p className="text-red-500 text-sm">{erro}</p>}
          <Button className="w-full" onClick={handleLogin}>
            Entrar
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
