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
          justifyContent="center"
          alignItems="center"
          padding="40px 10px"
          borderRadius="5vmin"
          gap="50px"
          width="70%"
          maxWidth="1000px"
          height="max(50vmin fit-content)"
          sx={{ border: `1px solid ${theme.palette.primary.main}` }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
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
