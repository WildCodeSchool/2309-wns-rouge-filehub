import React from "react";
import { useRouter } from "next/router";
import Header from "@/layout/header";
import FileListItem from "@/components/FileList";
import styled from "styled-components";
import { useQuery } from "@apollo/client";
import { queryMe } from "@/graphql/queryMe";
import { getUserFiles } from "@/graphql/getUserFiles";

const MainContent = styled.div`
  position: fixed;
  top: 66px;
  width: 100%;
  min-height: calc(100vh - 66px);
`

const MyFiles: React.FC = () => {
    const router = useRouter();

    const { loading: meLoading, error: meError, data: meData } = useQuery(queryMe);
    const userId = meData?.me?.id;

    const { loading, error, data } = useQuery(getUserFiles, {
        variables: { userId },
        skip: !userId, // Skip la requête si l'ID de l'utilisateur n'est pas disponible
    });

    if (meLoading) return <p>Loading...</p>;
    if (meError) return <p>Error: {meError.message}</p>;

    return (
        <>
            <Header />
            <MainContent>
                <div style={{ marginTop: '70px' }}>
                    {loading ? <p>Loading...</p> :
                        error ? <p>Error: {error.message}</p> :
                            <FileListItem files={data.filesCurrentUser} />
                    }
                </div>
            </MainContent>
        </>
    );
};

export default MyFiles;
