import { gql } from "@apollo/client";

export const mutationDeleteFile = gql`
  mutation deleteFile($id: ID!) {
    deleteFile(id: $id) {
      id
    }
  }
`;
