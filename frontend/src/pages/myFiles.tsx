import React from "react";
import Header from "@/layout/header";
import FileList from "@/components/FileList";
import { MainContent } from ".";
import UploadNewFile from "@/components/UploadNewFile";
import { Stack, Typography, useTheme } from "@mui/material";

const MyFiles: React.FC = () => {
  const theme = useTheme();

  return (
    <>
      <Header />
      <MainContent>
        <Stack
          sx={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            padding: "20px 10px",
            border: `1px solid ${theme.palette.primary.main}`,
            borderRadius: "5vmin",
            width: "70%",
            maxWidth: "1000px",
            height: "max(50vmin, fit-content)",
          }}
        >
          <Typography variant="h6" sx={{ marginY: "10px", fontWeight: 700 }}>
            Mes fichiers
          </Typography>
          <FileList />
          <UploadNewFile />
        </Stack>
      </MainContent>
    </>
  );
};

export default MyFiles;
