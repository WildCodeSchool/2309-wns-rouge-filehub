import React, { ChangeEvent, FormEvent, useState } from "react";
import axios from "axios";
import { API_URL } from "@/config";
import CircularProgress from "@mui/material/CircularProgress";

export function UploadFile() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false); // État de chargement

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedFile) {
      console.error("Aucun fichier sélectionné.");
      return;
    }
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setLoading(true);
      await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Erreur lors du chargement du fichier :", error);
    }
  };

  return (
      <>
        <h1>Upload files</h1>
        <form onSubmit={handleUpload}>
          <input type="file" name="image" onChange={handleFileChange} />
          <button type="submit" disabled={loading}>
            {loading ? (
                <CircularProgress size={24} color="inherit" />
            ) : (
                "Upload"
            )}
          </button>
        </form>
      </>
  );
}
