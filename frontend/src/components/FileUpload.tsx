import { Button, TextField, colors } from "@mui/material";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { theme } from "@/styles/theme";
import { Label, InputField, ButtonSVGContainer, ButtonConfirm, Container, Title } from "./UserProfile";
import PublishIcon from '@mui/icons-material/Publish';
import LinkIcon from '@mui/icons-material/Link';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

const FileUploadContent = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`;

const FileInfo = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 5vmin 12vmin;
    border: 1px solid ${theme.palette.secondary.main};
    border-radius: 5vmin;
    width: 35vmin;
    height: max(50vmin, fit-content);
    color: ${theme.palette.primary.main};
`;

const FileButton = styled(Button)`
    &.MuiButtonBase-root {
        width: 100%;
        height: 50px;
        margin: 2px 0;
        box-shadow: none;
        border-radius: 50px;
        text-transform: none;
    }
`;

const LabelButton = styled.label`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    cursor: pointer;
`;

const ThrowFileButton = styled(Button)`
    &.MuiButtonBase-root {
        position: absolute;
        width: 40px;
        height: 40px;
        right: -60px;
    }
`;

function FileUpload(): React.ReactNode {
    const [file, setFile] = useState<File>();
    const [fileName, setFileName] = useState("");

    const setFileInfo = (e: React.ChangeEvent<HTMLInputElement>)=>{
        const fileInput = e.target;

        if(fileInput.files && fileInput.files.length === 1){
            setFile(fileInput.files[0]);
        }
    }

    useEffect(()=>{
        if(file){
            setFileName(file.name);
        } else {
            setFileName("");
        }
    }, [file])

    return(
        <FileUploadContent>
            <FileInfo>
                <Title>Ajouter un fichier</Title>
                <Container>
                    <FileButton variant="contained" sx={file === undefined ? {background: theme.palette.secondary.main} 
                    : {background: "linear-gradient(90deg, rgba(250,209,38,1) 0%, rgba(255,84,79,1) 75%, rgba(255,84,79,1) 100%)"}}>
                        <LabelButton>
                            Charger un fichier
                            <ButtonSVGContainer>
                                <PublishIcon color="primary"/>
                            </ButtonSVGContainer>
                            <input hidden type="file" onChange={(e)=>{setFileInfo(e)}}/>
                        </LabelButton>
                    </FileButton>
                    {file && 
                    <ThrowFileButton onClick={()=>{setFile(undefined)}}>
                        <HighlightOffIcon color="primary"/>
                    </ThrowFileButton>
                    }
                </Container>
                <Container>
                    <Label>
                        <InputField label="Nom du Fichier à télécharger" variant="outlined" type="text"
                        value={fileName} onChange={(e)=>{setFileName(e.target.value)}}/>
                    </Label>
                </Container>
                <Container>
                    <ButtonConfirm>
                        Obtenir un lien
                        <ButtonSVGContainer>
                        <LinkIcon color="primary"/>
                        </ButtonSVGContainer>
                    </ButtonConfirm>
                </Container>
            </FileInfo>
        </FileUploadContent>
    )
}

export default FileUpload;