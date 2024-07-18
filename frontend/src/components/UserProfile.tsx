import { Box, Button, IconButton, TextField, Typography } from "@mui/material";
import { useState } from "react";
import styled from "styled-components";
import { theme } from "@/styles/theme";
import { useRouter } from "next/router";
import KeyIcon from "@mui/icons-material/Key";
import PersonIcon from "@mui/icons-material/Person";
import { queryMe } from "@/graphql/queryMe";
import { useMutation, useQuery } from "@apollo/client";
import { mutationUpdatePassword } from "@/graphql/mutationUpdatePassword";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import VisibilityIcon from "@mui/icons-material/Visibility";

export const UserProfileContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

export const UserInfo = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 30px 70px;
  border: 1px solid ${theme.palette.primary.main};
  border-radius: 5vmin;
  color: ${theme.palette.primary.main};
`;

export const Title = styled.h2`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

export const Label = styled.label`
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 95%;
  font-size: 2.5vmin;
`;

export const FieldTitle = styled.p`
  width: 100%;
  margin: 0;
`;

export const Field = styled.p`
  width: 95%;
  min-height: 25px;
  margin: 2px 0;
  background-color: whitesmoke;
  border-radius: 50px;
  align-content: center;
  padding: 2vmin 5% 2vmin 5%;
  overflow-wrap: anywhere;
`;

export const InputField = styled(TextField)`
  & .MuiOutlinedInput-root {
    height: 55px;
    margin: 2px 0;
    border-radius: 55px;
    padding: 2vmin 5% 2vmin 5%;
  }
`;

export const ButtonText = styled(Button)`
  &.MuiButtonBase-root {
    color: ${theme.palette.secondary.main};
    border-radius: 50px;
    padding: 0;
    display: flex;
    justify-content: left;
    text-transform: none;
    width: 100%;
    min-width: 350px;
  }
`;

export const ButtonConfirm = styled(Button)`
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

export const DivLoadFile = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50vmin;
  margin: 1rem 0;
`;

export const ButtonSVGContainer = styled.div`
  position: absolute;
  right: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  border-radius: 100%;
  height: 40px;
  width: 40px;
  color: black;
`;

export const Container = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  margin: 1rem 0;
`;

export const MenuIcon = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  right: 0;
  top: 0;
  height: 65px;
  width: 75px;
  border-radius: 100%;
`;

function UserProfile(): React.ReactNode {
  const { data: me } = useQuery(queryMe, { fetchPolicy: "no-cache" });
  const [toggleModif, setToggleModif] = useState(false);
  const [passWord, setPassWord] = useState("");
  const [newPassWord, setNewPassWord] = useState("");
  const [secNewPassWord, setSecNewPassWord] = useState("");
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
        toast.success("Password changed");
        setPassWord("");
        setNewPassWord("");
        setSecNewPassWord("");
        setToggleModif(!toggleModif);
      }
    } catch {
      toast.error(
        "Echec du changement de mdp, vérifiez les informations entrées",
      );
    }
  };

  return (
    <UserProfileContent>
      <UserInfo>
        <Typography
          variant="h6"
          sx={{
            marginY: "10px",
            fontWeight: 700,
            color: theme.palette.common.black,
          }}
        >
          Informations personnelles
        </Typography>
        <Label>
          <Typography color={theme.palette.common.black} fontSize={"14.5px"}>
            Email :
          </Typography>
          <Field
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "14.5px",
            }}
          >
            {me && me.me.email}
          </Field>
        </Label>

        <Container>
          {toggleModif ? (
            <>
              <Label>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 2,
                  }}
                >
                  <InputField
                    label="Entrez votre mot de passe actuel"
                    variant="outlined"
                    type={seePassWord ? "text" : "password"}
                    value={passWord}
                    onChange={(e) => setPassWord(e.target.value)}
                    sx={{
                      width: "90%",
                    }}
                  />
                  <IconButton
                    onClick={() => {
                      setSeePassWord(!seePassWord);
                    }}
                  >
                    <VisibilityIcon
                      sx={{
                        width: 20,
                        height: 20,
                        color: seePassWord ? "rgba(250, 209, 38, 1)" : "",
                      }}
                    />
                  </IconButton>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 2,
                  }}
                >
                  <InputField
                    label="Entrez votre nouveau mot de passe"
                    variant="outlined"
                    type={seeNewPassWord ? "text" : "password"}
                    value={newPassWord}
                    onChange={(e) => setNewPassWord(e.target.value)}
                    sx={{
                      width: "90%",
                    }}
                  />
                  <IconButton
                    onClick={() => {
                      setSeeNewPassWord(!seeNewPassWord);
                    }}
                  >
                    <VisibilityIcon
                      sx={{
                        width: 20,
                        height: 20,
                        color: seeNewPassWord ? "rgba(250, 209, 38, 1)" : "",
                      }}
                    />
                  </IconButton>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 2,
                  }}
                >
                  <InputField
                    label="Confirmez votre nouveau mot de passe"
                    variant="outlined"
                    type={seeSecNewPassWord ? "text" : "password"}
                    value={secNewPassWord}
                    onChange={(e) => setSecNewPassWord(e.target.value)}
                    sx={{
                      width: "90%",
                    }}
                  />
                  <IconButton
                    onClick={() => {
                      setSeeSecNewPassWord(!seeSecNewPassWord);
                    }}
                  >
                    <VisibilityIcon
                      sx={{
                        width: 20,
                        height: 20,
                        color: seeSecNewPassWord ? "rgba(250, 209, 38, 1)" : "",
                      }}
                    />
                  </IconButton>
                </Box>
              </Label>
            </>
          ) : (
            <>
              <Label>
                <Typography
                  color={theme.palette.common.black}
                  fontSize={"14.5px"}
                >
                  Mot de passe :
                </Typography>
                <Field>
                  <KeyIcon color="primary" />
                </Field>
              </Label>
            </>
          )}
          {toggleModif ? (
            <>
              <ButtonConfirm onClick={changePassword}>Confirmer</ButtonConfirm>
              <ButtonText onClick={() => setToggleModif(!toggleModif)}>
                Abandon
              </ButtonText>
            </>
          ) : (
            <ButtonText onClick={() => setToggleModif(!toggleModif)}>
              Modification de mot de passe
            </ButtonText>
          )}
        </Container>
      </UserInfo>
    </UserProfileContent>
  );
}

export default UserProfile;
