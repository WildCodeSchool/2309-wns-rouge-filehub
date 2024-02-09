import { gql } from "@apollo/client";

export const mutationFile = gql`
  mutation CreateFile($data: FileCreateInput!) {
    createFile(data: $data) {
      id
      originalName
      uniqueName
      mimeType
      size
      path
      url
      uploadAt
    }
  }
`;
