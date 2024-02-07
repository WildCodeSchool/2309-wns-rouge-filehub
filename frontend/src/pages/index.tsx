import { useRouter } from 'next/router';
import Header from '@/layout/header';
import { TestStyled } from '@/components/TestStyled';
import { UploadFile } from '@/components/UploadFile';

export default function Home(): React.ReactNode {
  const router = useRouter();

  return (
    <>
      <Header />
      <TestStyled />
      <UploadFile />
    </>
  );
}
