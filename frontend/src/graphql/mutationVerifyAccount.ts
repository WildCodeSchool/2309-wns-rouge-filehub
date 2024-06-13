import { gql } from "@apollo/client";

export const mutationVerifyAccount = gql`
    mutation VerifyAccount($token: String!) {
        verifyAccount(token: $token) {
            id
            email
        }
    }
`;