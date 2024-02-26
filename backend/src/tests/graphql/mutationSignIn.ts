import gql from "graphql-tag";

export const mutationSignin = gql`
  mutation Signin($password: String!, $email: String!) {
    signin(password: $password, email: $email) {
      id
    }
  }
`;
