import { Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { theme } from "@/styles/theme";
import {
  Label,
  InputField,
  ButtonSVGContainer,
  ButtonConfirm,
  Container,
  Title,
  MenuIcon,
} from "./UserProfile";
import LinkIcon from "@mui/icons-material/Link";
import FileOpenIcon from "@mui/icons-material/FileOpen";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import AddLinkIcon from "@mui/icons-material/AddLink";
import Slide from "@mui/material/Slide";
import axios from "axios";
import { dataBaseFile } from "./FileUploaded";
import { toast } from "react-toastify";
import { API_URL } from "@/config";
import { useDropzone } from "react-dropzone";

interface fileUploadProps {
  setFileUploaded: (fun: dataBaseFile | undefined) => void;
}
interface FileInfoProps {
  isDragAccept?: boolean;
  isDragReject?: boolean;
}

const getColor = (props: FileInfoProps) => {
  if (props.isDragAccept) {
    return "#00e676";
  }
  if (props.isDragReject) {
    return "#ff1744";
  }
  return `${theme.palette.secondary.main}`;
};

export const FileUploadContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

export const FileInfo = styled.div<FileInfoProps>`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 5vmin 12vmin;
  border: 1px solid ${theme.palette.primary.light};
  transition: border 0.24s ease-in-out;
  border-radius: 5vmin;
  width: 40vmin;
  height: max(50vmin, fit-content);
  color: ${theme.palette.primary.main};
`;

export const FileButton = styled(Button)`
  &.MuiButtonBase-root {
    width: 100%;
    height: 50px;
    margin: 2px 0;
    box-shadow: none;
    border-radius: 50px;
    text-transform: none;
    background-color: #c2bebe;
  }
`;

export const LabelButton = styled.label`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  cursor: pointer;
  color: white;
`;

export const ThrowFileButton = styled(Button)`
  &.MuiButtonBase-root {
    position: absolute;
    width: 40px;
    height: 40px;
    right: -60px;
  }
`;

function FileUpload({ setFileUploaded }: fileUploadProps): React.ReactNode {
  const [file, setFile] = useState<File>();
  const [fileName, setFileName] = useState("");
  const [checkAnim, setCheckAnim] = useState<boolean>(true);

  const { getRootProps, getInputProps, isDragAccept, isDragReject } =
    useDropzone({
      onDrop: (acceptedFiles) => {
        setFile(acceptedFiles[0]);
        setFileName(acceptedFiles[0].name);
      },
    });

  const setFileInfo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.target;

    if (fileInput.files && fileInput.files.length === 1) {
      setFile(fileInput.files[0]);
    }
  };

  useEffect(() => {
    if (file) {
      setFileName(file.name);
    } else {
      setFileName("");
    }
  }, [file]);

  const handleUpload = async () => {
    if (!file) {
      toast.error("Aucun fichier sélectionné...");
      return;
    }

    const formData = new FormData();
    formData.append("file", file, encodeURIComponent(fileName));

    try {
      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      setCheckAnim(false);
      setTimeout(() => {
        setFileUploaded(response.data);
      }, 250);
    } catch (error) {
      console.error("Erreur lors du dépot du fichier : ", error);
      toast.error("Erreur lors du dépot du fichier...");
    }
  };

  return (
    <Slide
      direction="left"
      in={checkAnim}
      exit={!checkAnim}
      mountOnEnter
      unmountOnExit
      timeout={{
        enter: 250,
        exit: 250,
      }}
    >
      <FileUploadContent {...getRootProps()}>
        <FileInfo
          isDragAccept={isDragAccept}
          isDragReject={isDragReject}
          onClick={(e) => e.stopPropagation()}
        >
          <MenuIcon>
            <AddLinkIcon color="primary" fontSize="large" />
          </MenuIcon>
          <Typography
            variant="h6"
            sx={{
              marginY: "10px",
              fontWeight: 700,
              color: theme.palette.common.black,
            }}
          >
            Ajouter un fichier
          </Typography>
          <Container>
            <FileButton
              variant="contained"
              sx={
                file === undefined
                  ? { background: theme.palette.secondary.main }
                  : {
                      background:
                        "linear-gradient(90deg, rgba(250,209,38,1) 0%, rgba(255,84,79,1) 75%, rgba(255,84,79,1) 100%)",
                    }
              }
            >
              <LabelButton>
                Déposer un fichier
                <ButtonSVGContainer>
                  <FileOpenIcon />
                </ButtonSVGContainer>
                <input
                  hidden
                  type="file"
                  onChange={(e) => {
                    setFileInfo(e);
                  }}
                />
              </LabelButton>
            </FileButton>
            {file && (
              <ThrowFileButton
                onClick={() => {
                  setFile(undefined);
                }}
              >
                <HighlightOffIcon color="primary" />
              </ThrowFileButton>
            )}
          </Container>
          <Container>
            <Label>
              <InputField
                label="Nom du fichier"
                variant="outlined"
                type="text"
                value={fileName}
                disabled={!file}
                onChange={(e) => {
                  setFileName(e.target.value);
                }}
              />
            </Label>
          </Container>
          <Container>
            <ButtonConfirm onClick={handleUpload}>
              Obtenir un lien
              <ButtonSVGContainer>
                <LinkIcon />
              </ButtonSVGContainer>
            </ButtonConfirm>
          </Container>
        </FileInfo>
      </FileUploadContent>
    </Slide>
  );
}

export default FileUpload;
