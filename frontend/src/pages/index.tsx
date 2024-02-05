import {useRouter} from "next/router";
import Header from "@/layout/header";
import {TestStyled} from '@/components/TestStyled';
import UserProfile from "@/components/UserProfile";
import styled from "styled-components";

const MainContent = styled.div`
    position: fixed;
    top: 66px;
    width: 100%;
    min-height: calc(100vh - 66px);
`

export default function Home(): React.ReactNode {
    const router = useRouter();

    /*<TestStyled/>*/
    return (
        <>
            <Header/>
            <MainContent>
                <UserProfile/>
            </MainContent>
        </>

    )
}


