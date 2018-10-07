const graphql = require("graphql");
const axios = require("axios");
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList
} = graphql;

// * Declaring the company type
const CompanyType = new GraphQLObjectType({
  name: "Company",
  fields: () => ({
    // ? Needs to be function bc JS runs functions after entire file is executed, vars are initialized
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    employees: {
      type: new GraphQLList(UserType),
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/companies/${parentValue.id}/users`)
          .then(response => response.data);
      }
    }
  })
});

// * Declaring the user type
const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
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
  })
});

// * Sets entry point for querying a user by id
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/users/${args.id}`)
          .then(response => response.data); // ? Axios returns data wrapped in a { data: { firstName: "Mike", ... } } object
      }
    },
    company: {
      type: CompanyType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/companies/${args.id}`)
          .then(response => response.data); // ? Axios returns data wrapped in a { data: { firstName: "Mike", ... } } object
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});
