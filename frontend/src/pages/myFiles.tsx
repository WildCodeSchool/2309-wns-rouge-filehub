import React from "react";
import { useRouter } from "next/router";
import Header from "@/layout/header";
import FileListItem from "@/components/FileList";
import styled from "styled-components";

const MainContent = styled.div`
  position: fixed;
  top: 66px;
  width: 100%;
  min-height: calc(100vh - 66px);
`

const myFiles: React.FC = () => {

    const files = [
        { id: 1 , name: 'Fichier1.txt', addedDate: '2024-02-02', expirationDate: '2024-05-02', link: '/path/to/file1' },
        { id: 2 , name: 'Fichier2.txt', addedDate: '2024-02-02', expirationDate: '2024-05-02', link: '/path/to/file2' },
    ];

    return (
        <>
            <Header />
            <MainContent>
                <div style={{ marginTop: '70px' }}>
                    <FileListItem files={files} />
                </div>
            </MainContent>
        </>
    );
};

export default myFiles;