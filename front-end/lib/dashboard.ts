import api from "./api"

export async function fetchUserId() {
  const response = await api.post("", {
    query: `query { me { id } }`,
  })
  return response.data.data.me.id
}

export async function fetchTransacoes(userId: string) {
  const response = await api.post("", {
    query: `query {
      transacoesPorUsuario(userId: ${userId}) {
        valor
        categoria
      }
    }`,
  })
  return response.data.data.transacoesPorUsuario
}

export async function fetchSaldo(userId: string) {
  const response = await api.post("", {
    query: `query {
      saldoUsuario(userId: ${userId})
    }`,
  })
  return response.data.data.saldoUsuario
}
