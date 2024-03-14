import FileUpload from "../components/FileUpload";
import FileUploaded, { dataBaseFile } from "@/components/FileUploaded";
import Header from "@/layout/header";
import { MainContent } from ".";
import { useState } from "react";

function FileUploadPage(): React.ReactNode {
  const [fileUploaded, setFileUploaded] = useState<dataBaseFile | undefined>(
    undefined,
  );

  return (
    <>
      <Header />
      <MainContent>
        {fileUploaded ? (
          <FileUploaded file={fileUploaded} setFileUploaded={setFileUploaded} />
        ) : (
          <FileUpload setFileUploaded={setFileUploaded} />
        )}
      </MainContent>
    </>
  );
}

export default FileUploadPage;
