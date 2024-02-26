import gql from "graphql-tag";

export const FindUserById = gql`
  query FindUserById($userId: ID!) {
    user(id: $userId) {
      email
    }
  }
`;
