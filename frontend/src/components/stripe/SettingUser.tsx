import React from "react";
import { useMutation } from "@apollo/client";
import { mutationCreateSettingSession } from "@/graphql/mutationSettingsStripe";
import { Button } from "@mui/material";

export const SettingButton = () => {
  const [createSettingSession] = useMutation(mutationCreateSettingSession, {
    onCompleted: (data) => {
      // Redirection vers la page de paiement Stripe
      window.location.href = data.createSettingSession;
    },
    onError: (err) => {
      console.error("Error creating setting session:", err);
      alert("Failed to create a setting session. Please try again.");
    },
  });

  const handleSetting = () => {
    createSettingSession();
  };

  return (
    <Button
      onClick={handleSetting}
      sx={{
        background:
          "linear-gradient(90deg, rgba(250, 209, 38, 1) 0%, rgba(255, 84, 79, 1) 75%, rgba(255, 84, 79, 1) 100%)",
        color: "white",
        borderRadius: "15px",
        padding: 0,
        marginTop: "1.5rem",
        textTransform: "none",
        width: "250px",
        height: "50px",
        fontSize: "1rem",
      }}
    >
      Gérer mon abonnement
    </Button>
  );
};
