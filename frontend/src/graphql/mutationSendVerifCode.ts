import { gql } from "@apollo/client";

export const mutationSendVerifCode = gql`
    mutation SendVerifCode($email: String!) {
        sendVerifCode(email: $email)
    }
`;