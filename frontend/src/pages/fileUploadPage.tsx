import FileUpload from "../components/FileUpload";
import FileUploaded from "@/components/FileUploaded";
import Header from "@/layout/header";
import { MainContent } from ".";
import { useState } from "react";

function FileUploadPage(): React.ReactNode {
    const [fileUploaded, setFileUploaded] = useState(false);

    return(
        <>
            <Header/>
            <MainContent>
                {fileUploaded ? 
                    <FileUploaded fileLink="lienVersLeFichier" setFileUploaded={setFileUploaded}/>
                :
                    <FileUpload setFileUploaded={setFileUploaded}/>
                }
            </MainContent>
        </>
    )
}

export default FileUploadPage;