import gql from "graphql-tag";

export const mutationSignup = gql`
  mutation Signup($data: UserCreateInput!) {
    signup(data: $data) {
      id
    }
  }
`;
