import { useState, useEffect } from "react";
import AdCard from "./AdCard";
import { useQuery } from '@apollo/client';
import { queryAllAds } from "@/query&mutations";
import { Flipper, Flipped } from "react-flip-toolkit";
import { AdCardProps } from "@/types";

type RecentAdsProps = {
    searchTitle?: string;
    categoryId?: string
}

const RecentAds = (props: RecentAdsProps): React.ReactNode => {
    const [ads, setAds] = useState([] as AdCardProps[])
    const [pageSize, setPageSize] = useState(2);
    const [pagesCount, setPagesCount] = useState(0);
    const [page, setPage] = useState(1);

    const { loading, error, data } = useQuery(queryAllAds, {
        variables: {
            where: {
              ...(props.categoryId ? { categoryIn: [props.categoryId] } : {}),
              ...(props.searchTitle ? { searchTitle: props.searchTitle } : {}),
            },
            take: pageSize,
            skip: (page*pageSize)-pageSize
          },
        fetchPolicy: "no-cache"
    });

    useEffect(()=>{
        if (!loading && !error){
            setAds(data.allAds);
            setPagesCount(Math.ceil(data.allAdsCount/pageSize));
        }
    }, [loading, page, pageSize]);

    useEffect(()=>{
        setPage(1);
    }, [pageSize])

    return (
        <main className="main-content">
            <h2>Annonces récentes</h2>
            <p>ads par pages :</p>
            <button disabled={pageSize===2} onClick={()=>{setPageSize(2)}}>2</button>
            <button disabled={pageSize===5} onClick={()=>{setPageSize(5)}}>5</button>
            <button disabled={pageSize===10} onClick={()=>{setPageSize(10)}}>10</button>
            <p>page actuelle: {page}</p>
            <button disabled={page === 1} 
            onClick={()=>{setPage(Math.max(page-1, 1))}}>Previous page</button>
            <button disabled={page >= pagesCount} 
            onClick={()=>{setPage(Math.min(page+1, pagesCount))}}>Next page</button>
            <Flipper flipKey={ads} spring='stiff'>
                <section className="recent-ads">
                    {ads.map((ad) => (
                        <Flipped flipId={ad.id} stagger>
                            <div key={ad.id}>
                                <AdCard
                                    id={ad.id}
                                    title={ad.title}
                                    price={ad.price}
                                    picture={ad.picture}
                                    link={"/ads/"+ad.id}
                                />
                            </div>
                        </Flipped>
                    ))}
                </section>
            </Flipper>
        </main>
    )
}
export default RecentAds;