import gql from "graphql-tag";

export const QueryAllUsers = gql`
  query AllUsers {
    allUsers {
      email
      id
    }
  }
`;
