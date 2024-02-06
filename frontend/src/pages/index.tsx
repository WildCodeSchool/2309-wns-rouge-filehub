import {TestStyled} from "@/components/TestStyled";
import {useRouter} from "next/router";
import {Login} from "./Login";

export default function Home(): React.ReactNode {
  const router = useRouter();

  return (
    <>
      {/* <TestStyled /> */}
      <Login />
    </>
  );
}
