import gql from 'graphql-tag';

export const queryGetAllFiles = gql`
  query QueryGetAllFiles {
    allFiles {
      id
      originalName
    }
  }
`;
