const express = require('express');
const cors = require('cors');
const { graphqlHTTP } = require('express-graphql');
const jwt = require('jsonwebtoken');
const { schema, rootValue } = require('./graphql/schema');
require('dotenv').config();

const SECRET = process.env.JWT_SECRET || 'minha_chave_super_secreta';

const app = express();
app.use(cors());
app.use(express.json());

// Middleware para extrair o token do header
app.use('/graphql', (req, res, next) => {
  const auth = req.headers.authorization;
  if (auth && auth.startsWith('Bearer ')) {
    const token = auth.slice(7);
    try {
      const decoded = jwt.verify(token, SECRET);
      req.userId = decoded.userId;
    } catch (err) {
      console.warn("Token inválido:", err.message);
    }
  }
  next();
}, graphqlHTTP((req) => ({
  schema,
  rootValue,
  context: {
    userId: req.userId
  },
  graphiql: true
})));

app.listen(4000, () => {
  console.log('Servidor GraphQL rodando em http://localhost:4000/graphql');
});
