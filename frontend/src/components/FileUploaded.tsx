import { Button, Slide, Typography } from "@mui/material";
import { useState } from "react";
import styled from "styled-components";
import { theme } from "@/styles/theme";
import { FileUploadContent, FileInfo } from "./FileUpload";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import DoneIcon from "@mui/icons-material/Done";

interface fileUploadedProps {
  file: dataBaseFile;
  setFileUploaded: (fun: dataBaseFile | undefined) => void;
}

export interface dataBaseFile {
  id: number;
  mimeType: string;
  name: string;
  size: number;
  uploadedAt: string;
  url: string;
}

const Field = styled.p`
  width: 95%;
  min-height: 25px;
  margin: 2px 0;
  background-color: whitesmoke;
  border-radius: 50px;
  align-content: center;
  padding: 2vmin 5% 2vmin 5%;
  overflow-wrap: anywhere;
`;

const Container = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  margin: 1rem 0;
`;

const ButtonSVGContainer = styled.div`
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

const MenuIcon = styled.div`
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

const ButtonConfirm = styled(Button)`
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

export const ButtonCopy = styled(Button)`
  &.MuiButtonBase-root {
    position: relative;
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

function FileUploaded({
  file,
  setFileUploaded,
}: fileUploadedProps): React.ReactNode {
  const [copied, setCopied] = useState(false);

  const handleCopy = (link: string) => {
    navigator.clipboard.writeText(link);
    setCopied(true);
  };

  return (
    <Slide
      direction="right"
      in={true}
      mountOnEnter
      unmountOnExit
      timeout={{
        enter: 250,
        exit: 250,
      }}
    >
      <FileUploadContent>
        <FileInfo>
          <MenuIcon>
            <DoneIcon color="primary" fontSize="large" />
          </MenuIcon>
          <Typography
            variant="h6"
            sx={{
              marginY: "10px",
              fontWeight: 700,
              color: theme.palette.common.black,
            }}
          >
            Téléchargement terminé !
          </Typography>
          <Container>
            <Field
              style={{
                padding: "22px",
                fontFamily: "Poppins, sans-serif",
                fontSize: "14.5px",
              }}
            >
              {file.url}
            </Field>
          </Container>
          <Container>
            <ButtonCopy
              variant="contained"
              onClick={() => handleCopy(file.url)}
              sx={
                !copied
                  ? { background: theme.palette.primary.main }
                  : {
                      background:
                        "linear-gradient(90deg, rgba(250,209,38,1) 0%, rgba(255,84,79,1) 75%, rgba(255,84,79,1) 100%)",
                    }
              }
            >
              Copier le lien
              <ButtonSVGContainer>
                {copied ? <DoneIcon /> : <ContentCopyIcon />}
              </ButtonSVGContainer>
            </ButtonCopy>
          </Container>
          *
          <Container>
            <ButtonConfirm onClick={() => setFileUploaded(undefined)}>
              Nouveau fichier
              <ButtonSVGContainer>
                <KeyboardBackspaceIcon />
              </ButtonSVGContainer>
            </ButtonConfirm>
          </Container>
        </FileInfo>
      </FileUploadContent>
    </Slide>
  );
}

export default FileUploaded;
