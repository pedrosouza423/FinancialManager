const { Transaction, User } = require('../../models');

const transactionResolvers = {
  async transacoes() {
    return Transaction.findAll({ include: ['tags', 'User'] });
  },

  async transacao(_, { id }) {
    return Transaction.findByPk(id, { include: ['tags', 'User'] });
  },

  async criarTransacao(_, { valor, tipo, descricao, imagem, categoria, tags }, context) {
    try {
      const nova = await Transaction.create({
        valor,
        tipo,
        descricao,
        imagem,
        categoria,
        userId: 1 // <- por enquanto fixo. Depois usar auth!
      });

      if (tags?.length > 0) {
        const usuarios = await User.findAll({ where: { id: tags } });
        await nova.setTags(usuarios);
      }

      return await Transaction.findByPk(nova.id, { include: ['tags', 'User'] });
    } catch (e) {
      console.error('Erro ao criar transação:', e);
      return null;
    }
  }
};

module.exports = { transactionResolvers };
