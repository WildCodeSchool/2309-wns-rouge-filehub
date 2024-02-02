import {useRouter} from "next/router";
import { TestStyled } from "@/components/TestStyled";
import UserProfile from "@/components/UserProfile";;

export default function Home(): React.ReactNode {
  const router = useRouter();

  return (
    <UserProfile />
  );
}
