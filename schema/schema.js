const graphql = require("graphql");
const axios = require("axios");
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
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

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addUser: {
      type: UserType,
      args: {
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        lastName: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        companyId: { type: GraphQLString }
      },
      resolve(parentValue, { firstName, lastName, age }) {
        return axios
          .post("http://localhost:3000/users", {
            firstName,
            lastName,
            age
          })
          .then(response => response.data);
      }
    },
    deleteUser: {
      type: UserType,
      args: {
        id: { type: GraphQLString }
      },
      resolve(parentValue, args) {
        return axios
          .delete(`http://localhost:3000/users/${args.id}`)
          .then(response => response.data);
      }
    },
    editUser: {
      type: UserType,
      args: {
        id: { type: GraphQLString },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        age: { type: GraphQLInt },
        companyId: { type: GraphQLString }
      },
      resolve(parentValue, args) {
        return axios
          .patch(`http://localhost:3000/users/${args.id}`, args)
          .then(response => response.data);
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: mutation
});
