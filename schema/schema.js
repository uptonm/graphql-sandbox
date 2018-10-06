const graphql = require("graphql");
const _ = require("lodash");
const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema } = graphql;

// * Temporary data store
const users = [
  { id: "1", firstName: "Mike", lastName: "Upton", age: 20 },
  { id: "2", firstName: "Matt", lastName: "Smith", age: 27 },
  { id: "3", firstName: "George", lastName: "Matthews", age: 10 }
];

// * Declaring the user type
const UserType = new GraphQLObjectType({
  name: "User",
  fields: {
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    age: { type: GraphQLInt }
  }
});

// * Sets entry point for querying a user by id
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return _.find(users, { id: args.id }); // ? Iterate through array and find the first user with the id of args.id
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});
