import { 
  buildSchema, graphql, GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLInputObjectType
} from 'graphql';
import crypto from 'crypto';

const fakeDatabase = {};
const fakeUserDB = {};

class RandomMethods {
  login ({ email, password }) {
    return `Successful login ${email}`
  }

  logout () {
    return `You've been logged out. Byeeeee!`
  }

  addSomeNumbers (one, two) {
    return one + two
  }
}

class Message {
  constructor(id, {content, author}) {
    this.id = id;
    this.content = content;
    this.author = author;
  }
}

class User {
  constructor(id, { name, email }) {
    this.name = name;
    this.id = id;
    this.email = email;
  }
}

const root = {
  randomMethods: () => new RandomMethods(),

  getMessage: ({id}) => {
    if (!fakeDatabase[id]) {
      throw new Error(`Message with id ${id} not found.`)
    }
    return new Message(id, fakeDatabase[id]);
  },

  createMessage: ({input}) => {
    const id = crypto.randomBytes(10).toString('hex');
    fakeDatabase[id] = input;
    return new Message(id, input);
  },

  updateMessage: ({id, input}) => {
    if (!fakeDatabase[id]) {
      throw new Error(`Message with id ${id} not found.`)
    }
    fakeDatabase[id] = input;
    return new Message(id, input);
  },

  createUser: ({input}) => {
    const id = crypto.randomBytes(10).toString('hex');
    fakeUserDB[id] = input;
    return new User(id, input);
  },

  getUser: ({id}) => {
    if (!fakeUserDB[id]) {
      throw new Error(`User with id ${id} not found.`)
    }
    return new User(id, fakeUserDB[id]);
  },

  deleteUser: ({id}) => {
    if (!fakeUserDB[id]) {
      throw new Error(`User with id ${id} not found.`)
    }
    const userData = fakeUserDB[id]
    delete fakeUserDB[id];
    return new User(id, userData);
  }
}

// const schema = buildSchema(`
//   input MessageInput {
//     content: String!
//     author: String!
//   }

//   type Message {
//     id: ID!
//     content: String!
//     author: String!
//   }

//   type RandomMethods {
//     login(email: String!, password: String!): String
//     logout: String
//     addSomeNumbers(one: Int!, two: Int!): Int
//   }

//   type Query {
//     randomMethods: RandomMethods
//     getMessage(id: ID!): Message
//   }

//   type Mutation {
//     createMessage(input: MessageInput): Message
//     updateMessage(id: ID!, input: MessageInput): Message
//   }
// `);

const userType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: GraphQLString }
  }
});

const UserInputType = new GraphQLInputObjectType({
  name: 'UserInputType',
  fields: {
    name: { type: GraphQLString },
    email: { type: GraphQLString }
  }
})

const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    user:  {
      type: userType,
      args: {
        id: { type: GraphQLString }
      },
      resolve: (_, {id}) => {
        return fakeUserDB[id]
      }
    },
    
    getUser: {
      type: userType,
      args: {
        id: { type: GraphQLString }
      }
    }
  }
});

const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createUser: {
      type: userType,
      args: {
        input: { type: UserInputType }
      }
    },

    deleteUser: {
      type: userType,
      args: {
        id: { type: GraphQLString },
      }
    }
  }
});

const schema = new GraphQLSchema({ query: queryType, mutation: mutationType });


export { root, schema }
