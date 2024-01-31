import RecentAds from "@/components/RecentAds";
import { useRouter } from "next/router";

const CategoryFilter = (): React.ReactNode => {
    const router = useRouter();
    const categoryId = String(router.query.id);

    return (
        <RecentAds
            categoryId={categoryId}
        />
    )
}
export default CategoryFilter;