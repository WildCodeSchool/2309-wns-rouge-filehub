import { Button, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import styled from "styled-components";
import { theme } from "@/styles/theme";
import { queryMe } from "@/graphql/queryMe";
import { useMutation, useQuery } from "@apollo/client";
import { mutationUpdatePassword } from "@/graphql/mutationUpdatePassword";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import VisibilityIcon from "@mui/icons-material/Visibility";

export const InputField = styled(TextField)`
  fontfamily: Poppins, sans-serif;
  fontsize: 14.5px;
  width: 100%;
  height: 55px;
  & .MuiOutlinedInput-root {
    border-radius: 55px;
  }
  & .MuiInputBase-input:-webkit-autofill {
    box-shadow: 0 0 0 1000px white inset;
    -webkit-box-shadow: 0 0 0 1000px white inset;
    -webkit-text-fill-color: black;
  }
`;

export const CustomButton = styled(Button)`
  &.MuiButtonBase-root {
    position: relative;
    background: linear-gradient(
      90deg,
      rgba(250, 209, 38, 1) 0%,
      rgba(255, 84, 79, 1) 75%,
      rgba(255, 84, 79, 1) 100%
    );
    color: white;
    border-radius: 50px;
    padding: 0;
    display: flex;
    justify-content: center;
    text-transform: none;
    width: 100%;
    height: 50px;
  }
`;

export const ButtonAbort = styled(Button)`
  &.MuiButtonBase-root {
    position: relative;
    background: #8080807d;
    color: white;
    border-radius: 50px;
    padding: 0;
    display: flex;
    justify-content: center;
    text-transform: none;
    width: 100%;
    height: 50px;

    &:hover {
      background: #808080c2;
    }
  }
`;

function UserProfile(): React.ReactNode {
  const { data: me } = useQuery(queryMe, { fetchPolicy: "no-cache" });
  const [toggleModif, setToggleModif] = useState<boolean>(false);
  const [passWord, setPassWord] = useState<string>("");
  const [newPassWord, setNewPassWord] = useState<string>("");
  const [secNewPassWord, setSecNewPassWord] = useState<string>("");
  const [seePassWord, setSeePassWord] = useState<boolean>(false);
  const [seeNewPassWord, setSeeNewPassWord] = useState<boolean>(false);
  const [seeSecNewPassWord, setSeeSecNewPassWord] = useState<boolean>(false);
  const [updatePassword] = useMutation(mutationUpdatePassword);

  const changePassword = async () => {
    try {
      const { data, errors } = await updatePassword({
        variables: {
          data: {
            password: passWord,
            newPassword1: newPassWord,
            newPassword2: secNewPassWord,
          },
        },
      });
      if (data && !errors) {
        toast.success("Mot de passe remplacé avec succès !");
        setPassWord("");
        setNewPassWord("");
        setSecNewPassWord("");
        setToggleModif(!toggleModif);
      }
    } catch {
      toast.error(
        "Echec lors du changement de mot de passe, vérifiez les informations du formulaire",
      );
    }
  };

  return (
    <Stack
      padding="30px 70px"
      border={`1px solid ${theme.palette.primary.main}`}
      borderRadius="5vmin"
      gap="30px"
      width="22rem"
    >
      <Typography
        variant="h6"
        mx="auto"
        sx={{
          fontWeight: 700,
          color: theme.palette.common.black,
        }}
      >
        Informations personnelles
      </Typography>
      <InputField
        value={me && me.me ? me.me.email : ""}
        label="Email"
        disabled
      />

      {toggleModif ? (
        <>
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            gap="10px"
          >
            <InputField
              label="Mot de passe actuel"
              variant="outlined"
              type={seePassWord ? "text" : "password"}
              value={passWord}
              onChange={(e) => setPassWord(e.target.value)}
            />

            <VisibilityIcon
              onClick={() => {
                setSeePassWord(!seePassWord);
              }}
              sx={{
                width: 20,
                height: 20,
                color: seePassWord ? "rgba(250, 209, 38, 1)" : "grey",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "none",
                },
              }}
            />
          </Stack>
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            gap="10px"
          >
            <InputField
              label="Nouveau mot de passe"
              variant="outlined"
              type={seeNewPassWord ? "text" : "password"}
              value={newPassWord}
              onChange={(e) => setNewPassWord(e.target.value)}
            />
            <VisibilityIcon
              onClick={() => {
                setSeeNewPassWord(!seeNewPassWord);
              }}
              sx={{
                width: 20,
                height: 20,
                color: seeNewPassWord ? "rgba(250, 209, 38, 1)" : "grey",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "none",
                },
              }}
            />
          </Stack>
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            gap="10px"
          >
            <InputField
              label="Nouveau mot de passe"
              variant="outlined"
              type={seeSecNewPassWord ? "text" : "password"}
              value={secNewPassWord}
              onChange={(e) => setSecNewPassWord(e.target.value)}
            />

            <VisibilityIcon
              onClick={() => {
                setSeeSecNewPassWord(!seeSecNewPassWord);
              }}
              sx={{
                width: 20,
                height: 20,
                color: seeSecNewPassWord ? "rgba(250, 209, 38, 1)" : "grey",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "none",
                },
              }}
            />
          </Stack>
        </>
      ) : (
        <InputField
          value="12345678910"
          type="password"
          label="Mot de passe"
          disabled
        />
      )}
      {toggleModif ? (
        <>
          <CustomButton onClick={changePassword}>Confirmer</CustomButton>
          <ButtonAbort onClick={() => setToggleModif(!toggleModif)}>
            Abandon
          </ButtonAbort>
        </>
      ) : (
        <CustomButton onClick={() => setToggleModif(!toggleModif)}>
          Modification du mot de passe
        </CustomButton>
      )}
    </Stack>
  );
}

export default UserProfile;
