import gql from "graphql-tag";

export const FindUserById = gql`
  query ($userId: ID!) {
    user(id: $userId) {
      email
    }
  }
`;
