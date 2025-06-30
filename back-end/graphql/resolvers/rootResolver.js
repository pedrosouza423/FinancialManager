const { userResolvers } = require('./userResolver');
const { transactionResolvers } = require('./transactionResolver');

module.exports.resolvers = {
  ...userResolvers,
  ...transactionResolvers,
  User: userResolvers.User,
  Transaction: transactionResolvers.Transaction
};
