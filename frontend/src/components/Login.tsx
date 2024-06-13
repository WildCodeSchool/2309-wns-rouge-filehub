import { FilehubIcon } from "@/styles/icon/FileHubIcon";
import { theme } from "@/styles/theme";
import { pxToRem } from "@/styles/cssTheme";
import {
  Box,
  Button,
  IconButton,
  Link,
  Tab,
  Tabs,
  TextField,
  CircularProgress
} from "@mui/material";
import { ChangeEvent, useState } from "react";
import styled from "styled-components";
import { useMutation } from "@apollo/client";
import { mutationSignup } from "@/graphql/mutationSignup";
import { mutationSignin } from "@/graphql/mutationSignin";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import VisibilityIcon from "@mui/icons-material/Visibility";

export const TextFieldStyled = styled(TextField)`
  & .MuiOutlinedInput-root {
    border-radius: 30px;
    min-height: ${pxToRem(56)};
  }
`;

export const StyledButton = styled(Button)`
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

const CustomTabs = styled(Tabs)`
  & .MuiTabs-flexContainer {
    display: flex;
    justify-content: space-between;
    border-radius: 30px;
    border: 1px solid ${theme.palette.primary.light};
    min-height: ${pxToRem(56)};
    margin-bottom: ${pxToRem(30)};
  }
  & .MuiTabs-indicator {
    display: none;
  }
`;

const CustomTab = styled(Tab)`
  &.MuiButtonBase-root {
    min-width: ${pxToRem(194)};
    border-radius: 30px;
    transition: color 0.3s;
  }
  &.Mui-selected {
    background: linear-gradient(
        90deg,
        rgba(250, 209, 38, 1) 0%,
        rgba(255, 84, 79, 1) 75%,
        rgba(255, 84, 79, 1) 100%
    );
    color: white !important;
  }
  &:not(.Mui-selected) {
    color: ${theme.palette.secondary.main};
  }
`;

export default function Login(): React.ReactNode {
  const [activeTab, setActiveTab] = useState(0);
  const [seePassWordLogin, setSeePassWordLogin] = useState<boolean>(false);
  const [seePassWordSignUp, setSeePassWordSignUp] = useState<boolean>(false);
  const [seePassWordSignUp2, setSeePassWordSignUp2] = useState<boolean>(false);
  const router = useRouter();

  const [signinEmail, setSigninEmail] = useState("");
  const [signinPassword, setSigninPassword] = useState("");

  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");

  const [signin] = useMutation(mutationSignin);
  const [signup] = useMutation(mutationSignup);

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (activeTab === 0) {
      if (signinEmail && signinPassword) {
        try {
          const { data } = await signin({
            variables: { email: signinEmail, password: signinPassword },
          });
          if (data.item) {
            router.push("/fileUploadPage");
          } else {
            toast.error("Email ou mot de passe incorrect.");
          }
        } catch (error) {
          console.error(error);
          toast.error("Erreur lors de la connexion.");
        } finally {
          setIsLoading(false);
        }
      } else {
        toast.error("Veuillez remplir tous les champs.");
        setIsLoading(false);
      }
    } else {
      if (signupEmail && signupPassword && signupConfirmPassword) {
        if (signupPassword === signupConfirmPassword) {
          try {
            const { data } = await signup({
              variables: {
                data: {
                  email: signupEmail,
                  password: signupPassword,
                },
              },
            });
            if (data.item) {
              toast.success("Inscription réussie !");
              setTimeout(() => {
                setActiveTab(0);
                setSignupEmail("");
                setSignupPassword("");
                setSignupConfirmPassword("");
              }, 3000);
            }
          } catch (error) {
            console.error(error);
            toast.error("Erreur lors de l'inscription.");
          } finally {
            setIsLoading(false);
          }
        } else {
          toast.error("Les mots de passe ne correspondent pas.");
          setIsLoading(false);
        }
      } else {
        toast.error("Veuillez remplir tous les champs.");
        setIsLoading(false);
      }
    }
  };

  const handleChangeTab = (e: ChangeEvent<{}>, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
      <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="100vh"
      >
        <FilehubIcon style={{ width: `${pxToRem(217)}`, height: "auto" }} />
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            border={1}
            borderColor={theme.palette.primary.light}
            borderRadius="30px"
            width={pxToRem(547)}
            height={pxToRem(550)}
            marginTop={pxToRem(30)}
        >
          <CustomTabs
              value={activeTab}
              onChange={handleChangeTab}
              aria-label="tabs"
          >
            <CustomTab label="Se connecter" />
            <CustomTab label="S'inscrire" />
          </CustomTabs>
          <form onSubmit={handleSubmit}>
            <Box display="flex" flexDirection="column" minWidth={pxToRem(388)}>
              {activeTab === 0 && (
                  <>
                    <TextFieldStyled
                        margin="normal"
                        label="Email"
                        name="email"
                        type="email"
                        value={signinEmail}
                        onChange={(e) => setSigninEmail(e.target.value)}
                        autoComplete="email"
                        autoFocus
                    />
                    <Box
                        sx={{
                          position: "relative",
                          display: "flex",
                          alignItems: "center",
                          width: "100%",
                        }}
                    >
                      <TextFieldStyled
                          fullWidth
                          margin="normal"
                          name="password"
                          label="Mot de passe"
                          type={seePassWordLogin ? "text" : "password"}
                          value={signinPassword}
                          onChange={(e) => setSigninPassword(e.target.value)}
                          autoComplete="current-password"
                      />
                      <IconButton
                          onClick={() => {
                            setSeePassWordLogin(!seePassWordLogin);
                          }}
                          sx={{
                            position: "absolute",
                            top: 27,
                            right: -36,
                          }}
                      >
                        <VisibilityIcon
                            sx={{
                              width: 20,
                              height: 20,
                              color: seePassWordLogin ? "rgba(250, 209, 38, 1)" : "",
                            }}
                        />
                      </IconButton>
                    </Box>
                    <Button
                        onClick={() => router.push("/forgot-password")}
                        sx={{ mt: 1, ml: 1, color: theme.palette.secondary.main }}
                    >
                      Mot de passe oublié ?
                    </Button>
                  </>
              )}
              {activeTab === 1 && (
                  <>
                    <TextFieldStyled
                        margin="normal"
                        label="Email"
                        name="email"
                        type="email"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        autoComplete="email"
                        autoFocus
                    />
                    <Box
                        sx={{
                          position: "relative",
                          display: "flex",
                          alignItems: "center",
                          width: "100%",
                        }}
                    >
                      <TextFieldStyled
                          fullWidth
                          margin="normal"
                          name="password"
                          label="Mot de passe"
                          type={seePassWordSignUp ? "text" : "password"}
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          autoComplete="current-password"
                      />
                      <IconButton
                          onClick={() => {
                            setSeePassWordSignUp(!seePassWordSignUp);
                          }}
                          sx={{
                            position: "absolute",
                            top: 27,
                            right: -36,
                          }}
                      >
                        <VisibilityIcon
                            sx={{
                              width: 20,
                              height: 20,
                              color: seePassWordSignUp ? "rgba(250, 209, 38, 1)" : "",
                            }}
                        />
                      </IconButton>
                    </Box>
                    <Box
                        sx={{
                          position: "relative",
                          display: "flex",
                          alignItems: "center",
                          width: "100%",
                        }}
                    >
                      <TextFieldStyled
                          fullWidth
                          margin="normal"
                          name="confirmPassword"
                          label="Confirmer votre mot de passe"
                          type={seePassWordSignUp2 ? "text" : "password"}
                          value={signupConfirmPassword}
                          onChange={(e) => setSignupConfirmPassword(e.target.value)}
                      />
                      <IconButton
                          onClick={() => {
                            setSeePassWordSignUp2(!seePassWordSignUp2);
                          }}
                          sx={{
                            position: "absolute",
                            top: 27,
                            right: -36,
                          }}
                      >
                        <VisibilityIcon
                            sx={{
                              width: 20,
                              height: 20,
                              color: seePassWordSignUp2
                                  ? "rgba(250, 209, 38, 1)"
                                  : "",
                            }}
                        />
                      </IconButton>
                    </Box>
                  </>
              )}
              <StyledButton type="submit" variant="contained" disabled={isLoading}>
                {isLoading ? <CircularProgress size={24} /> : (activeTab === 0 ? "Connexion" : "Valider mon inscription")}
              </StyledButton>
            </Box>
          </form>
        </Box>
      </Box>
  );
}
