const { buildSchema } = require('graphql');
const { resolvers } = require('./resolvers/userResolver');

const schema = buildSchema(`
  type User {
    id: ID!
    nome: String!
    email: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    usuarios: [User]
    usuarioPorId(id: ID!): User
    usuarioPorEmail(email: String!): User
  }

  type Mutation {
    criarUsuario(nome: String!, email: String!, senha: String!): User
    atualizarUsuario(id: ID!, nome: String, email: String, senha: String): User
    excluirUsuario(id: ID!): Boolean
  }
`);

module.exports = {
  schema,
  rootValue: resolvers
};
