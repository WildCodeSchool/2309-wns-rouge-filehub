import React, { useState } from "react";
import { Button, Card, Typography, CircularProgress } from "@mui/material";
import axios from "axios";
import styled from "styled-components";
import DownloadIcon from "@mui/icons-material/Download";
import { useQuery } from "@apollo/client";
import { getFileByUniqueName } from "@/graphql/getFileByUniqueName";
import { API_URL } from "@/config";
import { FileInfo, FileUploadContent } from "./FileUpload";

const StyledCard = styled(Card)`
  width: 80%;
  max-width: 600px;
  border-radius: 15px !important;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const TableContainerWrapper = styled.div`
  border-radius: 15px;
  overflow: hidden;
  text-align: center;
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
    width: 95%;
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

interface FileDownloadProps {
  fileName: string | string[] | undefined;
}

const FileDownload: React.FC<FileDownloadProps> = ({ fileName }) => {
  const { loading, error, data } = useQuery(getFileByUniqueName, {
    variables: { uniqueName: fileName },
    skip: !fileName,
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/download`, {
        params: {
          name: fileName,
        },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      if (typeof fileName === "string") {
        link.setAttribute("download", fileName);
      }

      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error downloading file:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
      >
        <StyledCard>
          <TableContainerWrapper>
            <Typography
                variant="h6"
                sx={{
                  marginY: "10px",
                  fontWeight: 700,
                  color: "black",
                }}
            >
              Votre fichier est à portée de clic !
            </Typography>
            {loading ? (
                <CircularProgress />
            ) : (
                data && data.getFile && (
                    <Typography marginBottom={"15px"}>
                      Nom du fichier: {data.getFile.originalName}
                    </Typography>
                )
            )}
            <DivLoadFile>
              <ButtonConfirm
                  variant="contained"
                  onClick={handleDownload}
                  disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} /> : "Télécharger"}
                {!isLoading && (
                    <ButtonSVGContainer>
                      <DownloadIcon />
                    </ButtonSVGContainer>
                )}
              </ButtonConfirm>
            </DivLoadFile>
          </TableContainerWrapper>
        </StyledCard>
      </div>
  );
};

export default FileDownload;
