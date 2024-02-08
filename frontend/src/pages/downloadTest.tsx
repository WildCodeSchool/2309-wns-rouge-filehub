import React from 'react';
import axios from 'axios';
const DownloadFileComponent = () => {
  const handleDownload = async () => {
    try {
      const response = await axios.get('http://localhost:5001/download', {
        params: {
          name: 'lettre_motivation.docx',
        },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'lettre_motivation.docx');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };
  return (
    <div>
      <p>
        Cliquez sur le lien suivant pour télécharger la lettre de motivation :
      </p>
      <a href='#' onClick={handleDownload}>
        Télécharger la lettre de motivation
      </a>
    </div>
  );
};
export default DownloadFileComponent;
