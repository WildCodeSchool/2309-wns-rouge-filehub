import { useRouter } from "next/router";
import Header from "@/layout/header";
import { TestStyled } from "@/components/TestStyled";
import { UploadFile } from "@/components/UploadFile";
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
`;

export default function Home(): React.ReactNode {
  const router = useRouter();

  return (
    <>
      <Header />
      <MainContent></MainContent>
      <UploadFile />
    </>
  );
}
