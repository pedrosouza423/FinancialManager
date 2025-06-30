const { User } = require('../../models'); // Importa corretamente do index.js da pasta models

const resolvers = {
  async criarUsuario({ nome, email, senha }) {
    try {
      const novoUsuario = await User.create({ nome, email, senha });
      return novoUsuario;
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      return null;
    }
  },

  async usuarios() {
    try {
      return await User.findAll();
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      return [];
    }
  }
};

module.exports = { resolvers };
