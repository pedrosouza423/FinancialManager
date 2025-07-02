'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    static associate(models) {
      // Quem criou a transação
      Transaction.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'criador'
      });

      // Tags (muitos para muitos)
      Transaction.belongsToMany(models.User, {
        through: 'TransactionTags',
        as: 'tags',
        foreignKey: 'transactionId',
        otherKey: 'userId'
      });
    }
  }

  Transaction.init({
    valor: DataTypes.FLOAT,
    tipo: DataTypes.STRING,
    descricao: DataTypes.STRING,
    imagem: DataTypes.STRING,
    categoria: DataTypes.STRING,
    data: DataTypes.DATE,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Transaction',
  });

  return Transaction;
};
