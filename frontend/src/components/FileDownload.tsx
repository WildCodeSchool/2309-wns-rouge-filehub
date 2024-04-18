import React, { useEffect } from "react";
import { Button, Card } from "@mui/material";
import axios from "axios";
import styled from "styled-components";
import DownloadIcon from "@mui/icons-material/Download";
import { useQuery } from "@apollo/client";
import { getFileByUniqueName } from "@/graphql/getFileByUniqueName";

const StyledCard = styled(Card)`
  margin: auto;
  margin-top: 120px;
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
    width: 40%;
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

  const handleDownload = async () => {
    try {
      const response = await axios.get("http://localhost:5001/download", {
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
          <h1>Votre fichier est à portée de clic !</h1>
          {data && data.getFile && (
            <p>Nom du fichier: {data.getFile.originalName}</p>
          )}
          <DivLoadFile>
            <ButtonConfirm variant="contained" onClick={handleDownload}>
              Télécharger
              <ButtonSVGContainer>
                <DownloadIcon />
              </ButtonSVGContainer>
            </ButtonConfirm>
          </DivLoadFile>
        </TableContainerWrapper>
      </StyledCard>
    </div>
  );
};

export default FileDownload;
