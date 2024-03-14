import { gql, useQuery } from "@apollo/client";

export const getUserFiles = gql`
  query FilesCurrentUser {
    filesCurrentUser {
      id
      mimeType
      originalName
      uniqueName
      path
      size
      uploadAt
      url
      createdBy {
        id
        email
      }
    }
  }
`;
