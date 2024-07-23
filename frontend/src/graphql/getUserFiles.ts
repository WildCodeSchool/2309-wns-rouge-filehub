import { gql } from "@apollo/client";

export const getUserFiles = gql`
  query FilesCurrentUser($limit: Int, $offset: Int, $sortOrder: String) {
    filesCurrentUser(limit: $limit, offset: $offset, sortOrder: $sortOrder) {
      files {
        id
        mimeType
        originalName
        uniqueName
        size
        uploadAt
        url
        createdBy {
          id
          email
        }
      }
      total
    }
  }
`;
