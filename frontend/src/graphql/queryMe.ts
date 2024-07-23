import { gql } from "@apollo/client";

export const queryMe = gql`
  query me {
    me {
      id
      email
      plan
    }
  }
`;
