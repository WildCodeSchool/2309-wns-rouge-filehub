import {FilehubIcon} from "@/styles/icon/FileHubIcon";
import {theme} from "@/styles/theme";
import {Button} from "@mui/material";
import styled from "styled-components";

const StyledTestButton = styled(Button)`
  background-color: red;
`;
const StyledTestButton2 = styled(Button)`
  background-color: red;
`;

const StyledTest = styled.div`
  color: ${theme.palette.primary.main};
  background-color: green;
`;

export const TestStyled = () => {
  return (
    <>
      <StyledTest>TEXTE TEST</StyledTest>
      <StyledTestButton>BOUTON TEST</StyledTestButton>
      <StyledTestButton2>BOUTON TEST 2</StyledTestButton2>
      <FilehubIcon style={{width: "150px", height: "auto"}} />
    </>
  );
};
