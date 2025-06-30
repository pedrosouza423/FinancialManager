const { buildSchema } = require('graphql');
const { resolvers } = require('./resolvers/rootResolver');

// Definição do schema GraphQL
const schema = buildSchema(`

  # Tipos principais

  type User {
    id: ID!
    nome: String!
    email: String!
    transacoesCriadas: [Transaction]       # Transações criadas por este usuário
    tags: [Transaction]                    # Transações nas quais ele foi marcado
  }

  type Transaction {
    id: ID!
    valor: Float!
    tipo: String!
    descricao: String
    imagem: String
    categoria: String
    criador: User!                         # Dono/criador da transação
    tags: [User]                           # Pessoas envolvidas no gasto
  }

  # Consultas (Queries)

  type Query {
    # Usuários
    usuarios: [User]
    usuarioPorId(id: ID!): User
    usuarioPorEmail(email: String!): User

    # Transações
    transacoes: [Transaction]
    transacaoPorId(id: ID!): Transaction
    transacoesPorUsuario(userId: ID!): [Transaction]
  }

  # Mutations (operações que alteram dados)

  type Mutation {
    # Usuário
    criarUsuario(nome: String!, email: String!, senha: String!): User
    atualizarUsuario(id: ID!, nome: String, email: String, senha: String): User
    excluirUsuario(id: ID!): Boolean

    # Transação
    criarTransacao(
      valor: Float!,
      tipo: String!,
      descricao: String,
      imagem: String,
      categoria: String,
      userId: ID!,
      tagIds: [ID!]
    ): Transaction

    atualizarTransacao(
      id: ID!,
      valor: Float,
      tipo: String,
      descricao: String,
      imagem: String,
      categoria: String,
      tagIds: [ID!]
    ): Transaction

    excluirTransacao(id: ID!): Boolean
  }
`);

module.exports = {
  schema,
  rootValue: resolvers
};
