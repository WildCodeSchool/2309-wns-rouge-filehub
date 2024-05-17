import { gql } from "@apollo/client";

export const mutationforgotPassword = gql`
mutation forgotPassword($email: String!) {
    forgotPassword(email: $email)
}
`;
