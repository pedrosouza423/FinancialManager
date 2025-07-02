'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Um usuário pode criar várias transações
      User.hasMany(models.Transaction, {
        foreignKey: 'userId',
        as: 'transacoesCriadas',
      });

      // Um usuário pode ser tag em várias transações (muitos para muitos)
      User.belongsToMany(models.Transaction, {
        through: 'TransactionTags',
        as: 'tags',
        foreignKey: 'userId',
        otherKey: 'transactionId',
      });
    }
  }

  User.init(
    {
      nome: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      senha: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'User',
    }
  );

  return User;
};
