import { Button } from "@mui/material";
import { useState } from "react";
import styled from "styled-components";
import { theme } from "@/styles/theme";
import {
  Label,
  ButtonSVGContainer,
  ButtonConfirm,
  Container,
  Title,
  Field,
  FieldTitle,
  MenuIcon,
} from "./UserProfile";
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
  path: string;
  size: number;
  uploadedAt: string;
  url: string;
}

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
    <FileUploadContent>
      <FileInfo>
        <MenuIcon>
          <DoneIcon color="primary" fontSize="large" />
        </MenuIcon>
        <Title>Téléchargement terminé!</Title>
        <Container>
          <Label>
            <FieldTitle>Votre lien :</FieldTitle>
            <Field
              onClick={() => handleCopy(file.path)}
              style={{ cursor: "pointer" }}
            >
              {file.path}
            </Field>
          </Label>
        </Container>
        <Container>
          <ButtonCopy
            variant="contained"
            onClick={() => handleCopy(file.path)}
            sx={
              !copied
                ? { background: theme.palette.secondary.main }
                : {
                    background:
                      "linear-gradient(90deg, rgba(250,209,38,1) 0%, rgba(255,84,79,1) 75%, rgba(255,84,79,1) 100%)",
                  }
            }
          >
            Copier le lien
            <ButtonSVGContainer>
              {copied ? (
                <DoneIcon color="primary" />
              ) : (
                <ContentCopyIcon color="primary" />
              )}
            </ButtonSVGContainer>
          </ButtonCopy>
        </Container>
        <Container>
          <ButtonConfirm onClick={() => setFileUploaded(undefined)}>
            Nouveau fichier
            <ButtonSVGContainer>
              <KeyboardBackspaceIcon color="primary" />
            </ButtonSVGContainer>
          </ButtonConfirm>
        </Container>
      </FileInfo>
    </FileUploadContent>
  );
}

export default FileUploaded;
