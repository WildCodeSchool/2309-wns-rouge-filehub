import { gql } from "@apollo/client";

export const mutationFile = gql`
  query GetUserFiles($userId: ID!) {
    userFiles(userId: $userId) {
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