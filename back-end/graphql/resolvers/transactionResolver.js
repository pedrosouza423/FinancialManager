const { Transaction, User } = require('../../models');

const transactionResolvers = {
  // Queries
  transacoes: async () => {
    return await Transaction.findAll({
      include: [
        { model: User, as: 'criador', attributes: ['id', 'nome'] },
        { model: User, as: 'tags', attributes: ['id', 'nome'] }
      ]
    });
  },

  transacaoPorId: async ({ id }) => {
    return await Transaction.findByPk(id, {
      include: [
        { model: User, as: 'criador', attributes: ['id', 'nome'] },
        { model: User, as: 'tags', attributes: ['id', 'nome'] }
      ]
    });
  },

  transacoesPorUsuario: async ({ userId }) => {
    return await Transaction.findAll({
      where: { userId },
      include: [
        { model: User, as: 'criador', attributes: ['id', 'nome'] },
        { model: User, as: 'tags', attributes: ['id', 'nome'] }
      ]
    });
  },

  transacoesPorTag: async ({ userId }) => {
    try {
      const usuario = await User.findByPk(userId);
      if (!usuario) return [];

      const transacoes = await usuario.getTags({
        include: [
          { model: User, as: 'criador', attributes: ['id', 'nome'] },
          { model: User, as: 'tags', attributes: ['id', 'nome'] }
        ]
      });

      return transacoes;
    } catch (error) {
      console.error('Erro ao buscar transações por tag:', error.message);
      return [];
    }
  },

  saldoUsuario: async ({ userId }) => {
    try {
      const transacoes = await Transaction.findAll({ where: { userId } });

      let saldo = 0;
      transacoes.forEach(t => {
        if (t.tipo === 'entrada') saldo += t.valor;
        if (t.tipo === 'saida') saldo -= t.valor;
      });

      return saldo;
    } catch (error) {
      console.error('Erro ao calcular saldo:', error.message);
      throw new Error('Erro ao calcular saldo');
    }
  },

  // Mutations
  criarTransacao: async ({ valor, tipo, descricao, imagem, categoria, userId, tagIds }) => {
    try {
      const transacoes = await Transaction.findAll({ where: { userId } });

      let saldo = 0;
      transacoes.forEach(t => {
        if (t.tipo === 'entrada') saldo += t.valor;
        if (t.tipo === 'saida') saldo -= t.valor;
      });

      if (tipo === 'saida' && valor > saldo) {
        throw new Error('Saldo insuficiente para realizar esta transação.');
      }

      const transacao = await Transaction.create({
        valor,
        tipo,
        descricao,
        imagem,
        categoria,
        userId
      });

      if (tagIds && tagIds.length > 0) {
        const usuarios = await User.findAll({ where: { id: tagIds } });
        await transacao.setTags(usuarios);
      }

      return await Transaction.findByPk(transacao.id, {
        include: [
          { model: User, as: 'criador', attributes: ['id', 'nome'] },
          { model: User, as: 'tags', attributes: ['id', 'nome'] }
        ]
      });
    } catch (error) {
      console.error('Erro ao criar transação:', error.message);
      throw new Error(error.message);
    }
  },

  atualizarTransacao: async ({ id, valor, tipo, descricao, imagem, categoria, tagIds }) => {
    try {
      const transacao = await Transaction.findByPk(id);
      if (!transacao) return null;

      if (valor !== undefined) transacao.valor = valor;
      if (tipo !== undefined) transacao.tipo = tipo;
      if (descricao !== undefined) transacao.descricao = descricao;
      if (imagem !== undefined) transacao.imagem = imagem;
      if (categoria !== undefined) transacao.categoria = categoria;

      await transacao.save();

      if (tagIds) {
        const usuarios = await User.findAll({ where: { id: tagIds } });
        await transacao.setTags(usuarios);
      }

      return await Transaction.findByPk(id, {
        include: [
          { model: User, as: 'criador', attributes: ['id', 'nome'] },
          { model: User, as: 'tags', attributes: ['id', 'nome'] }
        ]
      });
    } catch (error) {
      console.error('Erro ao atualizar transação:', error.message);
      throw new Error(error.message);
    }
  },

  excluirTransacao: async ({ id }) => {
    try {
      const transacao = await Transaction.findByPk(id);
      if (!transacao) return false;
      await transacao.destroy();
      return true;
    } catch (error) {
      console.error('Erro ao excluir transação:', error.message);
      return false;
    }
  },

  Transaction: {
    criador: async (transacao) => {
      return await User.findByPk(transacao.userId);
    },
    tags: async (transacao) => {
      return await transacao.getTags();
    }
  }
};

module.exports = { transactionResolvers };
