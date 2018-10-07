const graphql = require("graphql");
const axios = require("axios");
// * Uses Local Storage -- const _ = require("lodash");
const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema } = graphql;

// * Temporary data store
const users = [
  { id: "1", firstName: "Mike", lastName: "Upton", age: 20 },
  { id: "2", firstName: "Matt", lastName: "Smith", age: 27 },
  { id: "3", firstName: "George", lastName: "Matthews", age: 10 }
];
// * Declaring the company type
const CompanyType = new GraphQLObjectType({
  name: "Company",
  fields: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString }
  }
});
// * Declaring the user type
const UserType = new GraphQLObjectType({
  name: "User",
  fields: {
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    age: { type: GraphQLInt },
    company: {
      type: CompanyType,
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/companies/${parentValue.companyId}`)
          .then(response => response.data);
      }
    }
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
        // ! Uses local storage
        //return _.find(users, { id: args.id }); // ? Iterate through array and find the first user with the id of args.id
        return axios
          .get(`http://localhost:3000/users/${args.id}`)
          .then(response => response.data); // ? Axios returns data wrapped in a { data: { firstName: "Mike", ... } } object
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});
