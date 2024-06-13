import gql from "graphql-tag";

export const mutationSendVerifCode = gql`
    mutation ($email: String!) {
        sendVerifCode(email: $email)
    }
`;
