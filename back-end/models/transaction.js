'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    static associate(models) {
      // Uma transação é criada por um único usuário
      Transaction.belongsTo(models.User, { foreignKey: 'userId', as: 'criador' });

      // Uma transação pode ter múltiplos usuários marcados como "tags"
      Transaction.belongsToMany(models.User, {
        through: 'TransactionTags',
        as: 'tags',
        foreignKey: 'transactionId',
        otherKey: 'userId'
      });
    }
  }

  Transaction.init({
    valor: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    tipo: {
      type: DataTypes.ENUM('entrada', 'saida'),
      allowNull: false
    },
    descricao: DataTypes.STRING,
    imagem: DataTypes.STRING,
    categoria: DataTypes.STRING,
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Transaction',
  });

  return Transaction;
};
