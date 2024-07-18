import { gql } from "@apollo/client";

export const mutationUpdatePassword = gql`
  mutation ($data: UserUpdateInput!) {
    updatePasswordWhenConnected(data: $data) {
      id
      email
    }
  }
`;
