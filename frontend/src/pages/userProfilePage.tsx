import UserProfile from "../components/UserProfile";
import Header from "@/layout/header";
import { MainContent } from ".";

function UserProfilePage(): React.ReactNode {
  return (
    <>
      <Header />
      <MainContent>
        <UserProfile />
      </MainContent>
    </>
  );
}

export default UserProfilePage;
