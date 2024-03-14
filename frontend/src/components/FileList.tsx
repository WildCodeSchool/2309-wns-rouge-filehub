import React, { useState } from "react";
import styled from "styled-components";
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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
import DownloadIcon from "@mui/icons-material/Download";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { useRouter } from "next/router";

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

const StyledButtonIcon = styled(IconButton)<{ href?: string }>`
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

interface FileData {
  id: string;
  originalName: string;
  uploadAt: string;
  expirationDate: string;
  url: string;
}

const FileListItem = ({ files }: { files: FileData[] }) => {
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const handleCopy = (link: any) => {
    navigator.clipboard.writeText(link);
    setCopied(true);
  };

  const handleDelete = (file: any) => {};

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <StyledCard>
      <TableContainerWrapper>
        <CardContent>
          <Typography variant="h4" style={{ marginBottom: "16px" }}>
            Mes fichiers
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Date d&apos;ajout</StyledTableCell>
                  <StyledTableCell>Nom du fichier</StyledTableCell>
                  <StyledTableCell>Date d&apos;expiration</StyledTableCell>
                  <StyledTableCell style={{ textAlign: "center" }}>
                    Télécharger
                  </StyledTableCell>
                  <StyledTableCell style={{ textAlign: "center" }}>
                    Copier le lien
                  </StyledTableCell>
                  <StyledTableCell style={{ textAlign: "center" }}>
                    Supprimer
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {files.map((file) => (
                  <TableRow key={file.id}>
                    <TableCell>{formatDate(file.uploadAt)}</TableCell>
                    <TableCell>{file.originalName}</TableCell>
                    <TableCell>
                      {formatDate(
                        (
                          new Date(file.uploadAt).getTime() +
                          90 * 24 * 60 * 60 * 1000
                        ).toString(),
                      )}
                    </TableCell>
                    <TableCell style={{ textAlign: "center" }}>
                      <StyledButtonIcon href={file.url}>
                        <DownloadIcon />
                      </StyledButtonIcon>
                    </TableCell>
                    <TableCell
                      style={{ textAlign: "center", marginRight: "5px" }}
                    >
                      <Tooltip title="Copier le lien">
                        <StyledButtonIcon
                          onClick={() => handleCopy(file.url)}
                          aria-label="copy"
                        >
                          <InsertLinkIcon />
                        </StyledButtonIcon>
                      </Tooltip>
                    </TableCell>
                    <TableCell style={{ textAlign: "center" }}>
                      <Tooltip title="Supprimer">
                        <StyledButtonIcon
                          onClick={() => handleDelete(file)}
                          aria-label="delete"
                        >
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
