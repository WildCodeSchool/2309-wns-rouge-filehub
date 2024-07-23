import React from 'react';
import { mutationCreateCheckoutSession } from '@/graphql/mutationPayment';
import { useMutation } from '@apollo/client';

export const BuyButton = () => {
  const [createCheckoutSession] = useMutation(mutationCreateCheckoutSession, {
    onCompleted: data => {
      // Redirection vers la page de paiement Stripe
      window.location.href = data.createCheckoutSession;
    },
    onError: err => {
      console.error('Error creating checkout session:', err);
      alert('Failed to create a checkout session. Please try again.');
    }
  });

  const handleBuy = () => {
    createCheckoutSession();
  };

  return (
    <button onClick={handleBuy} style={{ fontSize: '16px', padding: '10px 20px', cursor: 'pointer' }}>
      S&apos;abonner
    </button>
  );
};