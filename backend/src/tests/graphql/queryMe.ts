import gql from "graphql-tag";

export const queryMe = gql`
  query Me {
    me {
      email
      id
    }
  }
`;
