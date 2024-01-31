import { useRouter } from "next/router";
import AdDetail from "@/components/AdDetail";
import { useEffect, useState } from "react";
import { useQuery, gql } from '@apollo/client';
import { AdDetailProps } from "@/types";
import { queryOneAd } from "@/query&mutations";

const AdDetailComponent = (): React.ReactNode => {
    const router = useRouter();
    const adId = router.query.id;
    const [ad, setAd] = useState({} as AdDetailProps);
    const { loading, error, data } = useQuery(queryOneAd, {
      variables: { getOneAdId: adId},
      skip: adId === undefined
    });

    useEffect(()=>{
      if (data){
        setAd(data.getOneAd);
      }
    }, [data])

    return (
        <AdDetail
            id={ad.id}
            title={ad.title}
            description={ad.description}
            owner={ad.owner}
            price={ad.price}
            picture={ad.picture}
            location={ad.location}
            createdAt={ad.createdAt}
            category={ad.category}
            link={ad.link}
            createdBy={ad.createdBy}
        />
    )
}

export default AdDetailComponent;