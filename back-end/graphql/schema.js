const { buildSchema } = require('graphql');
const { resolvers } = require('./resolvers/rootResolver');

const schema = buildSchema(`

  type User {
    id: ID!
    nome: String!
    email: String!
    transacoesCriadas: [Transaction]
    tags: [Transaction]
  }

  type Transaction {
    id: ID!
    valor: Float!
    tipo: String!
    descricao: String
    imagem: String
    categoria: String
    criador: User!
    tags: [User]
  }

  type AuthPayload {
    token: String!
    usuario: User!
  }

  type Query {
    usuarios: [User]
    usuarioPorId(id: ID!): User
    usuarioPorEmail(email: String!): User
    transacoes: [Transaction]
    transacaoPorId(id: ID!): Transaction
    transacoesPorUsuario(userId: ID!): [Transaction]
    transacoesPorTag(userId: ID!): [Transaction]
    
    # 🔧 Atualizado para não precisar de userId
    saldoUsuario: Float

    me: User
  }

  type Mutation {
    criarUsuario(nome: String!, email: String!, senha: String!): User
    atualizarUsuario(id: ID!, nome: String, email: String, senha: String): User
    excluirUsuario(id: ID!): Boolean

    login(email: String!, senha: String!): AuthPayload

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
