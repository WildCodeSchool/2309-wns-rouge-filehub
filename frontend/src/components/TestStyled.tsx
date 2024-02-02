import {theme} from "@/styles/theme";
import {Button} from "@mui/material";
import styled from "styled-components";

const StyledTestButton = styled(Button)`
  color: red;
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
    </>
  );
};
