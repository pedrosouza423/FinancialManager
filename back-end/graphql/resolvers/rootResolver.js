const { userResolvers } = require('./userResolver');
const { transactionResolvers } = require('./transactionResolver');

const resolvers = {
  ...userResolvers,
  ...transactionResolvers
};

module.exports = { resolvers };
