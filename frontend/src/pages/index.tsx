import {useRouter} from "next/router";
import Header from "@/layout/Header";

import styled from "styled-components";

const MainContent = styled.div`
    position: fixed;
    top: 66px;
    width: 100%;
    min-height: calc(100vh - 66px);
`

export default function Home(): React.ReactNode {
    const router = useRouter();

    return (
        <>
            <Header/>
            <MainContent>
            </MainContent>
        </>

    )
}
