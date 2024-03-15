import { gql } from "@apollo/client";

export const getFileByUniqueName = gql`
  query GetFileInfo($uniqueName: String!) {
    getFile(uniqueName: $uniqueName) {
      id
      mimeType
      originalName
      uniqueName
      size
      uploadAt
    }
  }
`;
