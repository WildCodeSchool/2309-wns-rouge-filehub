import React from 'react';
import { useMutation } from '@apollo/client';
import { mutationCreateSettingSession } from '@/graphql/mutationSettingsStripe';

export const SettingButton = () => {
  const [createSettingSession] = useMutation(mutationCreateSettingSession, {
    onCompleted: data => {
      // Redirection vers la page de paiement Stripe
      window.location.href = data.createSettingSession;
    },
    onError: err => {
      console.error('Error creating setting session:', err);
      alert('Failed to create a setting session. Please try again.');
    }
  });

  const handleSetting = () => {
    createSettingSession();
  };

  return (
    <button onClick={handleSetting} style={{ fontSize: '16px', padding: '10px 20px', cursor: 'pointer' }}>
      Gérer mon abonnement
    </button>
  );
};