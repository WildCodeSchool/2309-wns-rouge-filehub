import React, {useState} from 'react';
import styled from 'styled-components';
import {
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Tooltip,
    IconButton,
    Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import DownloadIcon from '@mui/icons-material/Download';
import FileUploadIcon from '@mui/icons-material/FileUpload';

const StyledCard = styled(Card)`
  margin: auto;
  margin-top: 16px;
  max-width: 900px;
`;

const StyledButton = styled(Button)`
  margin-left: 8px;
  background-color: orange !important;
  color: white !important;
`;
const UploadButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0%;
 
  width: 70%;
  margin: 0 auto;
  background: linear-gradient(to right, yellow, rgba(255, 99, 71, 0.8)); /* Modification de la couleur rouge avec une opacité réduite */
`;

const FileUploadIconStyled = styled(FileUploadIcon)`
  margin-left: 80px;
`;

const ButtonContainer = styled.div`
  text-align: center;
`;

const FileListItem = ({files}) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = (link) => {
        navigator.clipboard.writeText(link);
        setCopied(true);
    };

    const handleDelete = (file) => {
    };

    return (
        <StyledCard>
            <CardContent>
                <Typography variant="h4" style={{marginBottom: '16px'}}>Mes fichiers</Typography>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Date d'ajout</TableCell>
                                <TableCell>Nom du fichier</TableCell>
                                <TableCell>Date d'expiration</TableCell>
                                <TableCell>Télécharger</TableCell>
                                <TableCell>Copier le lien</TableCell>
                                <TableCell>Supprimer</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {files.map((file) => (
                                <TableRow key={file.id}>
                                    <TableCell>{file.addedDate}</TableCell>
                                    <TableCell>{file.name}</TableCell>
                                    <TableCell>{file.expirationDate}</TableCell>
                                    <TableCell>
                                        <StyledButton variant="contained" href={file.link}>
                                            <DownloadIcon/>
                                        </StyledButton>
                                    </TableCell>
                                    <TableCell>
                                        <Tooltip title={copied ? 'Lien copié !' : 'Copier le lien'}>
                                            <IconButton onClick={() => handleCopy(file.link)} aria-label="copy">
                                                <InsertLinkIcon/>
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell>
                                        <Tooltip title="Supprimer">
                                            <IconButton onClick={() => handleDelete(file)} aria-label="delete">
                                                <DeleteIcon/>
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>
            <ButtonContainer>
                <UploadButton style={{margin: "20px auto"}}>
                    Charger un nouveau fichier
                    <FileUploadIconStyled style={{justifyContent: "right"}}  />
                </UploadButton>
            </ButtonContainer>
        </StyledCard>
    );
};

export default FileListItem;
