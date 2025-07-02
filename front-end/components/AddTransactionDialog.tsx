'use client'

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"
import { createTransaction, fetchUserId } from "@/lib/dashboard"

interface Props {
  onSave?: () => void
}

export default function AddTransactionDialog({ onSave }: Props) {
  const [open, setOpen] = useState(false)
  const [tipo, setTipo] = useState<"entrada" | "saida">("entrada")
  const [valor, setValor] = useState("")
  const [categoria, setCategoria] = useState("")
  const [descricao, setDescricao] = useState("")
  const [data, setData] = useState("")
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [imagem, setImagem] = useState<File | null>(null)

  useEffect(() => {
    setData(format(new Date(), "yyyy-MM-dd"))
  }, [])

  function resetForm() {
    setTipo("entrada")
    setValor("")
    setCategoria("")
    setDescricao("")
    setData(format(new Date(), "yyyy-MM-dd"))
    setImagem(null)
  }

  async function handleSalvar() {
    try {
      const userId = await fetchUserId()
      await createTransaction({
        valor: parseFloat(valor),
        categoria,
        tipo,
        descricao,
        userId,
        // data e imagem ainda não são enviados, pode-se incluir depois
      })
      onSave?.()
      setOpen(false)
      resetForm()
    } catch (error) {
      console.error("Erro ao salvar transação:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full px-6 py-4 text-xl fixed bottom-6 right-6">+</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nova Transação</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue={tipo} onValueChange={(val) => setTipo(val as "entrada" | "saida")} className="w-full mb-4">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="saida">Despesa</TabsTrigger>
            <TabsTrigger value="entrada">Receita</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid gap-4">
          <div>
            <Label>Valor</Label>
            <Input
              type="number"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              placeholder="Ex: 100.00"
            />
          </div>
          <div>
            <Label>Categoria</Label>
            <Input
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              placeholder="Ex: Mercado, Transporte"
            />
          </div>
          <div>
            <Label>Comentário</Label>
            <Textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Opcional"
            />
          </div>
          <div>
            <Label>Data</Label>
            <Input
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
            />
          </div>
          <div>
            <Label>Comprovante</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setImagem(e.target.files?.[0] ?? null)}
            />
          </div>
          <Button onClick={handleSalvar} className="w-full">
            Salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
