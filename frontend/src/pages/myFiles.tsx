import React from "react";
import { useRouter } from "next/router";
import Header from "@/layout/Header";
import FileListItem from "@/components/FileList";
import styled from "styled-components";

const MainContent = styled.div`
  position: fixed;
  top: 66px;
  width: 100%;
  min-height: calc(100vh - 66px);
`

const myFiles: React.FC = () => {


    return (
        <>
            <Header />
            <MainContent>
                <div style={{ marginTop: '70px' }}>
                    <FileListItem/>
                </div>
            </MainContent>
        </>
    );
};

export default myFiles;