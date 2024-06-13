import * as React from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  CircularProgress, // Importez CircularProgress
} from "@mui/material";
import styled from "styled-components";
import { pxToRem } from "@/styles/cssTheme";
import { useState } from "react";
import { useRouter } from "next/router";
import { useMutation } from "@apollo/client";
import { mutationResetPassword } from "@/graphql/mutationResetPassword";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { FilehubIcon } from "@/styles/icon/FileHubIcon";

const StyledCard = styled(Card)`
  margin: auto;
  margin-top: 120px;
  width: 80%;
  max-width: 600px;
  border-radius: 15px !important;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const StyledTextField = styled(TextField)`
  & .MuiOutlinedInput-root {
    border-radius: 20px;
    min-height: ${pxToRem(56)};
  }
`;

const StyledButton = styled(Button)`
  &.MuiButtonBase-root {
    margin-top: ${pxToRem(30)};
    min-height: ${pxToRem(56)};
    border-radius: 30px;
    background: linear-gradient(
        90deg,
        rgba(250, 209, 38, 1) 0%,
        rgba(255, 84, 79, 1) 75%,
        rgba(255, 84, 79, 1) 100%
    );
    color: white;
  }
`;

const CancelButton = styled(Button)`
  color: rgba(250, 209, 38, 1);
`;

export default function VerificationInput({ onSubmit }: any) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [loading, setLoading] = useState(false); // État de chargement
  const router = useRouter();
  const token = router.query.token;

  const [updatePasswordFromCode] = useMutation(mutationResetPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword && confirmPassword && newPassword === confirmPassword) {
      try {
        setLoading(true); // Activer l'état de chargement
        const response = await updatePasswordFromCode({
          variables: { password: newPassword, token }
        });
        setLoading(false); // Désactiver l'état de chargement
        if (response.data) {
          toast.success("Mot de passe modifié avec succès!");
          setTimeout(() => {
            router.push("/login");
          }, 2000);
        } else {
          toast.error("Une erreur s'est produite lors de la modification du mot de passe.");
        }
      } catch (error) {
        setLoading(false); // Désactiver l'état de chargement en cas d'erreur
        toast.error("Erreur lors de la modification");
      }
    } else {
      setPasswordsMatch(false);
      toast.error("Les mots de passe ne correspondent pas.");
    }
  };

  const handleCancel = () => {
    router.push("/login");
  };

  return (
      <>
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100vh"
        >
          <FilehubIcon style={{ width: `${pxToRem(217)}`, height: "auto" }} />
          <StyledCard variant="outlined">
            <CardContent>
              <Typography variant="h5" align="center" gutterBottom>
                Modification du mot de passe
              </Typography>
              <form onSubmit={handleSubmit}>
                <Box display="flex" flexDirection="column">
                  <StyledTextField
                      margin="normal"
                      label="Nouveau mot de passe"
                      name="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      autoComplete="new-password"
                  />
                  <StyledTextField
                      margin="normal"
                      label="Confirmer le mot de passe"
                      name="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      autoComplete="new-password"
                  />
                  {!passwordsMatch && (
                      <Typography variant="body2" color="error">
                        Les mots de passe ne correspondent pas.
                      </Typography>
                  )}
                  <StyledButton type="submit" variant="contained" disabled={loading}>
                    {loading ? ( // Affichage conditionnel de CircularProgress
                        <CircularProgress size={24} color="inherit" />
                    ) : (
                        "Valider"
                    )}
                  </StyledButton>
                  <CancelButton onClick={handleCancel}>Annuler</CancelButton>
                </Box>
              </form>
            </CardContent>
          </StyledCard>
        </Box>
      </>
  );
}
