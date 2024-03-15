import gql from "graphql-tag";

export const queryGetAllFiles = gql`
  query {
    allFiles {
      id
      originalName
    }
  }
`;
