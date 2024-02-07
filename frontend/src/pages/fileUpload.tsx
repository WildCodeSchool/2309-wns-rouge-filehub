import FileUpload from "../components/FileUpload";
import Header from "@/layout/header";
import { MainContent } from ".";

function FileUploadPage(): React.ReactNode {
    return(
        <>
            <Header/>
            <MainContent>
                <FileUpload/>
            </MainContent>
        </>
    )
}

export default FileUploadPage;