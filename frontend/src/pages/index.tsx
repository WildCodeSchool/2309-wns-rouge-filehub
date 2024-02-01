import { useRouter } from "next/router";
import Header from "@/layout/header";

export default function Home(): React.ReactNode {
  const router = useRouter();

  return (
      <div>
      <Header />
    <>TEST</>
      </div>
  );
}


