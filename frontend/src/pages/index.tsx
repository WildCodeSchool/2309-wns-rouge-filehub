import {TestStyled} from "@/components/TestStyled";
import {useRouter} from "next/router";

export default function Home(): React.ReactNode {
  const router = useRouter();

  return <TestStyled />;
}
