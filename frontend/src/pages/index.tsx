import {useRouter} from "next/router";
import Header from "@/layout/header";
import UserProfile from "@/components/UserProfile";
import styled from "styled-components";

export const MainContent = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
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


