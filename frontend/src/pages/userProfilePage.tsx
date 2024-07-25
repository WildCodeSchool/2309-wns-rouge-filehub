import UserProfile from "../components/UserProfile";
import Header from "@/layout/header";
import { MainContent } from ".";
import { BuyButton } from "@/components/stripe/BuyButton";
import { SettingButton } from "@/components/stripe/SettingUser";
import { queryMe } from "@/graphql/queryMe";
import { useQuery } from "@apollo/client";

function UserProfilePage(): React.ReactNode {
  const { data } = useQuery(queryMe, { fetchPolicy: "no-cache" });
  return (
    <>
      <Header />
      <MainContent>
        <UserProfile />
        {data?.me?.plan == "FREE" && <BuyButton />}
        {data?.me?.plan == "PREMIUM" && <SettingButton />}

      </MainContent>
    </>
  );
}

export default UserProfilePage;
