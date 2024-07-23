import gql from "graphql-tag";

export const mutationVerifAccount = gql`
    mutation ($token: String!) {
        verifyAccount(token: $token) {
            id
            email
        }
    }
`;




