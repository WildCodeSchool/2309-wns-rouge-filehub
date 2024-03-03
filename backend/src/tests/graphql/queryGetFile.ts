import gql from "graphql-tag";

export const queryGetFile = gql`
  query ($uniqueName: String!) {
    getFile(uniqueName: $uniqueName) {
      id
      mimeType
      originalName
      path
      size
      uniqueName
      uploadAt
      url
    }
  }
`;
