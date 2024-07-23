import { gql } from '@apollo/client';

export const mutationCreateCheckoutSession = gql`
  mutation CreateCheckoutSession {
    createCheckoutSession
  }
`;