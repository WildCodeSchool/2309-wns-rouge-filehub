import { useRouter } from "next/router";
import UserProfile from "@/userProfile";

export default function Home(): React.ReactNode {
  const router = useRouter();

  return (
    <UserProfile/>
  );
}
