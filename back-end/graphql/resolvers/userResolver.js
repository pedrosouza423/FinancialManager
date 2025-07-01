const { User, Transaction } = require('../../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const SECRET = process.env.JWT_SECRET || 'minha_chave_super_secreta';

const userResolvers = {
  usuarios: async () => await User.findAll(),

  usuarioPorId: async ({ id }) => await User.findByPk(id),

  usuarioPorEmail: async ({ email }) => await User.findOne({ where: { email } }),

  criarUsuario: async ({ nome, email, senha }) => {
    const senhaHash = await bcrypt.hash(senha, 10);
    return await User.create({ nome, email, senha: senhaHash });
  },

  login: async ({ email, senha }) => {
    const usuario = await User.findOne({ where: { email } });
    if (!usuario) throw new Error("Usuário não encontrado");

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) throw new Error("Senha incorreta");

    const token = jwt.sign({ userId: usuario.id }, SECRET, { expiresIn: '7d' });

    return { token, usuario };
  },

  me: async (_args, context) => {
    if (!context.userId) throw new Error("Não autenticado");
    return await User.findByPk(context.userId);
  },

  atualizarUsuario: async ({ id, nome, email, senha }) => {
    const usuario = await User.findByPk(id);
    if (!usuario) return null;

    if (nome) usuario.nome = nome;
    if (email) usuario.email = email;
    if (senha) usuario.senha = await bcrypt.hash(senha, 10);

    await usuario.save();
    return usuario;
  },

  excluirUsuario: async ({ id }) => {
    const usuario = await User.findByPk(id);
    if (!usuario) return false;
    await usuario.destroy();
    return true;
  },

  User: {
    transacoesCriadas: async (user) => await Transaction.findAll({ where: { userId: user.id } }),
    tags: async (user) => await user.getTaggedTransactions()
  }
};

module.exports = { userResolvers };
