import React from "react";
import { mutationCreateCheckoutSession } from "@/graphql/mutationPayment";
import { useMutation } from "@apollo/client";
import { Button } from "@mui/material";

export const BuyButton = () => {
  const [createCheckoutSession] = useMutation(mutationCreateCheckoutSession, {
    onCompleted: (data) => {
      // Redirection vers la page de paiement Stripe
      window.location.href = data.createCheckoutSession;
    },
    onError: (err) => {
      console.error("Error creating checkout session:", err);
      alert("Failed to create a checkout session. Please try again.");
    },
  });

  const handleBuy = () => {
    createCheckoutSession();
  };

  return (
    <Button
      onClick={handleBuy}
      sx={{
        background:
          "linear-gradient(90deg, rgba(250, 209, 38, 1) 0%, rgba(255, 84, 79, 1) 75%, rgba(255, 84, 79, 1) 100%)",
        color: "white",
        borderRadius: "15px",
        padding: 0,
        marginTop: "1.5rem",
        textTransform: "none",
        width: "150px",
        height: "50px",
        fontSize: "1rem",
      }}
    >
      S&apos;abonner
    </Button>
  );
};
