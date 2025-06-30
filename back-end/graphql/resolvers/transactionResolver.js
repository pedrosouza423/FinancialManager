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

  // Mutations
  criarTransacao: async ({ valor, tipo, descricao, imagem, categoria, userId, tagIds }) => {
    try {
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
      console.error('Erro ao criar transação:', error);
      return null;
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
        await transacao.setTags(usuarios); // substitui as tags
      }

      return await Transaction.findByPk(id, {
        include: [
          { model: User, as: 'criador', attributes: ['id', 'nome'] },
          { model: User, as: 'tags', attributes: ['id', 'nome'] }
        ]
      });
    } catch (error) {
      console.error('Erro ao atualizar transação:', error);
      return null;
    }
  },

  excluirTransacao: async ({ id }) => {
    try {
      const transacao = await Transaction.findByPk(id);
      if (!transacao) return false;
      await transacao.destroy();
      return true;
    } catch (error) {
      console.error('Erro ao excluir transação:', error);
      return false;
    }
  },

  // Resolvedores de campo, se necessário
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
