const express = require('express');
const cors = require('cors');
const { graphqlHTTP } = require('express-graphql');
const { schema, rootValue } = require('./graphql/schema');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/graphql', graphqlHTTP({
  schema,
  rootValue,
  graphiql: true
}));

app.listen(4000, () => {
  console.log('Servidor GraphQL rodando em http://localhost:4000/graphql');
});
