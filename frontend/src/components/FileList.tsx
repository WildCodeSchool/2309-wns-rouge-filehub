import React, { useState } from 'react';
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
import { useRouter } from 'next/router';
import { useQuery } from "@apollo/client";
import { queryMe } from "@/graphql/queryMe";
import { mutationFile } from "@/graphql/mutationFile";

const StyledCard = styled(Card)`
  margin: auto;
  margin-top: 16px;
  max-width: 900px;
  border-radius: 15px !important;
`;

const TableContainerWrapper = styled.div`
  border-radius: 15px;
  overflow: hidden;
`;

const StyledTableCell = styled(TableCell)``;

const StyledButtonIcon = styled(IconButton)`
  background-color: transparent !important;
  color: orange !important;
`;

const DivLoadFile = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 16px;
`;

const ButtonConfirm = styled(Button)`
  &.MuiButtonBase-root {
    position: relative;
    background: linear-gradient(90deg, rgba(250, 209, 38, 1) 0%, rgba(255, 84, 79, 1) 75%, rgba(255, 84, 79, 1) 100%);
    color: white;
    border-radius: 50px;
    padding: 0;
    display: flex;
    justify-content: center;
    text-transform: none;
    width: 70%;
    height: 50px;
    margin-top: 1vmin;
    font-size: 14px;
  }
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
  color: black !important;
`;

const FileListItem = () => {
    const [copied, setCopied] = useState(false);
    const router = useRouter();
    const { loading: meLoading, error: meError, data: meData } = useQuery(queryMe);
    const userId = meData?.me?.id;

    const { loading, error, data } = useQuery(mutationFile, {
        variables: { userId },
        skip: !userId, // Skip the query if user ID is not available
    });

    const handleCopy = (link) => {
        navigator.clipboard.writeText(link);
        setCopied(true);
    };

    const handleDelete = (file) => {};

    if (loading || meLoading) return <p>Loading...</p>;
    if (error || meError) return <p>Error: {error?.message || meError?.message}</p>;

    return (
        <StyledCard>
            <TableContainerWrapper>
                <CardContent>
                    <Typography variant="h4" style={{ marginBottom: '16px' }}>Mes fichiers</Typography>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>Date d'ajout</StyledTableCell>
                                    <StyledTableCell>Nom du fichier</StyledTableCell>
                                    <StyledTableCell>Date d'expiration</StyledTableCell>
                                    <StyledTableCell style={{ textAlign: 'center' }}>Télécharger</StyledTableCell>
                                    <StyledTableCell style={{ textAlign: 'center' }}>Copier le lien</StyledTableCell>
                                    <StyledTableCell style={{ textAlign: 'center' }}>Supprimer</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data.userFiles.map((file) => (
                                    <TableRow key={file.id}>
                                        <TableCell>{file.addedDate}</TableCell>
                                        <TableCell>{file.name}</TableCell>
                                        <TableCell>{file.expirationDate}</TableCell>
                                        <TableCell style={{ textAlign: 'center' }}>
                                            <StyledButtonIcon href={file.link}>
                                                <DownloadIcon />
                                            </StyledButtonIcon>
                                        </TableCell>
                                        <TableCell style={{ textAlign: 'center', marginRight: '5px' }}>
                                            <Tooltip title={copied ? 'Lien copié !' : 'Copier le lien'}>
                                                <StyledButtonIcon onClick={() => handleCopy(file.link)} aria-label="copy">
                                                    <InsertLinkIcon />
                                                </StyledButtonIcon>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell style={{ textAlign: 'center' }}>
                                            <Tooltip title="Supprimer">
                                                <StyledButtonIcon onClick={() => handleDelete(file)} aria-label="delete">
                                                    <DeleteIcon />
                                                </StyledButtonIcon>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
                <DivLoadFile>
                    <ButtonConfirm onClick={() => router.push("/fileUploadPage")}>
                        Charger un nouveau fichier
                        <ButtonSVGContainer>
                            <FileUploadIcon />
                        </ButtonSVGContainer>
                    </ButtonConfirm>
                </DivLoadFile>
            </TableContainerWrapper>
        </StyledCard>
    );
};

export default FileListItem;
