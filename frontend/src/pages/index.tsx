import RecentAds from "@/components/RecentAds";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Home(): React.ReactNode {
  const router = useRouter();
  const [searchTitle, setSearchTitle] = useState<string>();

  useEffect(()=>{
    if (typeof(router.query.searchTitle) === "string") {
      setSearchTitle(router.query.searchTitle);
    }
  },[router.query.searchTitle])

  return (
    <RecentAds searchTitle={searchTitle}/>
  );
}
