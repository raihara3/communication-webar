import { makeExecutableSchema } from 'graphql-tools';
import { gql } from '@apollo/client';

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
  }
  type Query {
    user(id: ID!): User
  }
  type Mutation {
    addUser(id: ID!, name: String!): User
  }
`;

const resolvers = {
    Query: {
        user: async (_parent, { id }, _context, _info) => {
            return fetch('http://127.0.0.1:8000/health').then(() => {
                return { id: id, name: 'Kai Aihara' };
            });
        },
    },
    Mutation: {
        addUser: async (_parent, { id, name }, _context, _info) => {
            return fetch('http://127.0.0.1:8000/health', {
                method: 'POST',
            }).then(() => {
                return { id: id, name: 'Kai Aihara' };
            });
        },
    }
};

export const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
});
