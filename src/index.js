import express from 'express';
import graphqlHTTP from 'express-graphql';
import { root, schema } from './graphql';

/* Express Server */
const app = express();
const PORT = 4000;

app.use(express.json());

app.post('/graphql', graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true,
}));

app.listen(PORT, () => console.log(`Server is running on port ${PORT}!`));
