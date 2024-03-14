import React, { useState } from "react";
import axios from "axios";

export function UploadFile() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  const handleUpload = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      console.log("Aucun fichier sélectionné.");
      return;
    }
    const formData = new FormData();
    formData.append("file", selectedFile);
    try {
      await axios.post("http://localhost:5001/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      console.log("Fichier chargé avec succès.");
    } catch (error) {
      console.error("Erreur lors du chargement du fichier :", error);
    }
  };

  return (
    <>
      <h1>Upload files</h1>
      <form onSubmit={handleUpload}>
        <input type="file" name="image" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
    </>
  );
}
