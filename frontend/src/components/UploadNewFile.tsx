import { Button, Stack, useTheme } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";
import FileUploadIcon from "@mui/icons-material/FileUpload";

function UploadNewFile() {
  const router = useRouter();
  const theme = useTheme();
  return (
    <Button
      onClick={() => {
        router.push("/fileUploadPage");
      }}
      sx={{
        background:
          "linear-gradient(90deg, rgba(250, 209, 38, 1) 0%, rgba(255, 84, 79, 1) 75%, rgba(255, 84, 79, 1) 100%)",
        color: "white",
        borderRadius: "50px",
        padding: 0,
        textTransform: "none",
        width: "320px",
        height: "50px",
      }}
    >
      Charger un nouveau fichier
      <Stack
        sx={{
          position: "absolute",
          right: "5px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
          borderRadius: "100%",
          height: "40px",
          minHeight: "40px",
          width: "40px",
        }}
      >
        <FileUploadIcon sx={{ color: theme.palette.common.black }} />
      </Stack>
    </Button>
  );
}

export default UploadNewFile;
