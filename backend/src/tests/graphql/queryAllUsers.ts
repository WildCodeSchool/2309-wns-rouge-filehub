import gql from "graphql-tag";

export const QueryAllUsers = gql`
  query {
    allUsers {
      email
      id
    }
  }
`;
