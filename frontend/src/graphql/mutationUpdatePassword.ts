import { gql } from "@apollo/client";

export const mutationUpdatePassword = gql`
    mutation ($data: UserUpdateInput!) {
        updatePassword(data: $data) {
            id
            email
        }
    }
`;