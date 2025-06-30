const { User, Transaction } = require('../../models');

const userResolvers = {
  usuarios: async () => {
    return await User.findAll();
  },

  usuarioPorId: async ({ id }) => {
    return await User.findByPk(id);
  },

  usuarioPorEmail: async ({ email }) => {
    return await User.findOne({ where: { email } });
  },

  criarUsuario: async ({ nome, email, senha }) => {
    return await User.create({ nome, email, senha });
  },

  atualizarUsuario: async ({ id, nome, email, senha }) => {
    const usuario = await User.findByPk(id);
    if (!usuario) return null;

    if (nome) usuario.nome = nome;
    if (email) usuario.email = email;
    if (senha) usuario.senha = senha;

    await usuario.save();
    return usuario;
  },

  excluirUsuario: async ({ id }) => {
    const usuario = await User.findByPk(id);
    if (!usuario) return false;
    await usuario.destroy();
    return true;
  },

  // Resolvedores de campos
  User: {
    transacoesCriadas: async (user) => {
      return await Transaction.findAll({ where: { userId: user.id } });
    },
    tags: async (user) => {
      return await user.getTaggedTransactions(); // associação `belongsToMany`
    }
  }
};

module.exports = { userResolvers };
