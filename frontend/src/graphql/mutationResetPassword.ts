import {gql} from "@apollo/client";

export const mutationResetPassword = gql`
mutation updatePasswordWhenNotConnected($password: String!, $token: String!) {
  updatePasswordWhenNotConnected( password: $password, token: $token) {
    id
    email
  }
}
`;
