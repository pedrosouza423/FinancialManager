import api from "./api"

// Buscar ID do usuário logado
export async function fetchUserId() {
  const response = await api.post("", {
    query: `query { me { id } }`,
  })
  return response.data.data.me.id
}

// Buscar transações por usuário
export async function fetchTransacoes(userId: string) {
  const response = await api.post("", {
    query: `query {
      transacoesPorUsuario(userId: "${userId}") {
        id
        valor
        categoria
        tipo
        descricao
        imagem
        data
      }
    }`,
  })
  return response.data.data.transacoesPorUsuario
}

// Buscar saldo do usuário
export async function fetchSaldo(userId: string) {
  const response = await api.post("", {
    query: `query {
      saldoUsuario(userId: "${userId}")
    }`,
  })
  return response.data.data.saldoUsuario
}

// Tipo de entrada para criar transação
type NovaTransacaoInput = {
  valor: number
  categoria: string
  tipo: string
  descricao?: string
  imagem?: string
  data?: string
  userId: string
  tagIds?: string[]
}

// Criar nova transação
export async function createTransaction(input: NovaTransacaoInput) {
  const mutation = `
    mutation {
      criarTransacao(
        valor: ${input.valor},
        categoria: "${input.categoria}",
        tipo: "${input.tipo}",
        descricao: "${input.descricao || ""}",
        imagem: "${input.imagem || ""}",
        data: "${input.data || ""}",
        userId: "${input.userId}",
        tagIds: [${input.tagIds?.map((id) => `"${id}"`).join(",") || ""}]
      ) {
        id
        valor
        categoria
        tipo
        descricao
        imagem
        data
      }
    }
  `

  const response = await api.post("", { query: mutation })
  return response.data.data.criarTransacao
}
