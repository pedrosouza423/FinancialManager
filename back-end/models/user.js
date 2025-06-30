'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Um usuário pode criar muitas transações
      User.hasMany(models.Transaction, { foreignKey: 'userId', as: 'transacoesCriadas' });

      // Um usuário pode ser tag em várias transações (muitos-para-muitos)
      User.belongsToMany(models.Transaction, {
        through: 'TransactionTags',
        as: 'tags',
        foreignKey: 'userId',
        otherKey: 'transactionId'
      });
    }
  }

  User.init({
    nome: DataTypes.STRING,
    email: DataTypes.STRING,
    senha: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });

  return User;
};
