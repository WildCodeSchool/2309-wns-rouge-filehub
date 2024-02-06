import { FilehubIcon } from "@/styles/icon/FileHubIcon";
import { theme } from "@/styles/theme";
import { pxToRem } from "@/styles/cssTheme";
import { Box, Button, Link, Tab, Tabs, TextField } from "@mui/material";
import { ChangeEvent, useState } from "react";
import styled from "styled-components";

const TextFieldStyled = styled(TextField)`
  & .MuiOutlinedInput-root {
    border-radius: 30px;
    min-height: ${pxToRem(56)};
  }
  & .MuiInputLabel-root {
    padding-left: ${pxToRem(12)};
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

const CustomTabs = styled(Tabs)`
  & .MuiTabs-flexContainer {
    display: flex;
    justify-content: space-between;
    border-radius: 30px;
    border: 1px solid ${theme.palette.primary.main};
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
    transition: color 0.5s;
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
    color: ${theme.palette.primary.main};
  }
`;

export const Login = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleChangeTab = (e: ChangeEvent<{}>, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <FilehubIcon style={{ width: `${pxToRem(217)}`, height: "auto" }} />

      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        border={1}
        borderColor={theme.palette.primary.main}
        borderRadius="30px"
        width={pxToRem(547)}
        height={pxToRem(599)}
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
        <Box display="flex" flexDirection="column" minWidth={pxToRem(388)}>
          {activeTab === 0 && (
            <>
              <TextFieldStyled
                margin="normal"
                label="Email"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextFieldStyled
                margin="normal"
                name="password"
                label="Mot de passe"
                type="password"
                autoComplete="current-password"
              />
              <Link href="" variant="body2" sx={{ mt: 1, ml: 1 }}>
                Mot de passe oublié ?
              </Link>
            </>
          )}
          {activeTab === 1 && (
            <>
              <TextFieldStyled
                margin="normal"
                label="Email"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextFieldStyled
                margin="normal"
                name="password"
                label="Mot de passe"
                type="password"
                autoComplete="current-password"
              />
              <TextFieldStyled
                margin="normal"
                name="confirmPassword"
                label="Confirmer votre mot de passe"
                type="password"
              />
            </>
          )}
          <StyledButton type="submit" variant="contained">
            {activeTab === 0 ? "Connexion" : "Valider mon inscription"}
          </StyledButton>
        </Box>
      </Box>
    </Box>
  );
};
