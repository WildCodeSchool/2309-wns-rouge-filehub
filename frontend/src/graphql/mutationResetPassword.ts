import {gql} from "@apollo/client";

export const mutationResetPassword = gql`
mutation updatePasswordFromCode($password: String!, $token: String!) {
  updatePasswordFromCode( password: $password, token: $token) {
    id
    email
  }
}
`;
