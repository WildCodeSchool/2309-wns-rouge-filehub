import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AdForm from "./AdForm";
import { useMutation, useQuery } from '@apollo/client';
import { mutationDeleteAd, queryMe } from "@/query&mutations";
import { Flipper, Flipped } from "react-flip-toolkit";
import { AdDetailProps, UserType } from "@/types";

const AdDetail = (props: AdDetailProps): React.ReactNode => {
    const [dateAd, setDateAd] = useState("");
    const [message, setMessage] = useState("");
    const [showPatchMenu, setShowPatchMenu] = useState<boolean>(false);
    const router = useRouter();
    const [doDelete] = useMutation(mutationDeleteAd);

    const {data: meData} = useQuery<{me: UserType}>(queryMe);
    const [me, setMe] = useState(meData?.me)
    const [ownAd, setOwnAd] = useState(false);

    useEffect(()=>{
        if(me?.id === props.createdBy?.id){
            setOwnAd(true);
        } else {
            setOwnAd(false);
        }
    }, [me, props])
    
    async function deleteAd() {
        console.log(props);
        await doDelete({
          variables: {
            deleteAdId: props.id,
          },
        });
        router.push("/");
    }

    function showPatch() {
        if (showPatchMenu === true) {
            setShowPatchMenu(false);
        } else {
            setShowPatchMenu(true);
        }
    }

    useEffect(()=>{
        if (typeof(props.createdAt) === "string") {
            const date = props.createdAt.slice(0, 10);
            setDateAd(date);
        }
    }, [props.createdAt])

    return (
        <main className="main-content">
            <h2 className="ad-details-title">{props.title}</h2>
            <section className="ad-details">
                <div className="ad-details-image-container">
                    <img className="ad-details-image" src={props.picture} />
                </div>
                <div className="ad-details-info">
                    <div className="ad-details-price">{props.price}€</div>
                        <div className="ad-details-description">
                            {props.description}
                        </div>
                        <hr className="separator" />
                    <div className="ad-details-owner">
                    Annoncée publiée par <b>{props.owner}</b>/<b>{props.createdBy?.email}</b> le {dateAd}.
                </div>
                    {!ownAd &&
                    <a href="mailto:serge@serge.com" className="button button-primary link-button">
                        <svg aria-hidden="true"
                            width="16"
                            height="16"
                            viewBox="0 0 32 32"
                            xmlns="http://www.w3.org/2000/svg"
                            className="styled__BaseIcon-sc-1jsm4qr-0 llmHhT">
                            <path d="M25 4H7a5 5 0 0 0-5 5v14a5 5 0 0 0 5 5h18a5 5 0 0 0 5-5V9a5 5 0 0 0-5-5ZM7 6h18a3 3 0 0 1 2.4 1.22s0 0-.08 0L18 15.79a3 3 0 0 1-4.06 0L4.68 7.26H4.6A3 3 0 0 1 7 6Zm18 20H7a3 3 0 0 1-3-3V9.36l8.62 7.9a5 5 0 0 0 6.76 0L28 9.36V23a3 3 0 0 1-3 3Z" />
                        </svg>
                        Envoyer un email
                    </a>}
                    {ownAd &&<>
                    <button className="button" onClick={deleteAd}>Supprimer l'anonce {props.title}</button>
                    <button className="button" onClick={showPatch}>Modifier l'anonce {props.title}</button>
                    </>}
                    <div>{message}</div>
                </div>
            </section>
            <Flipper flipKey={showPatchMenu}>
                <Flipped flipId={1} stagger>
                    <div>
                        {showPatchMenu && 
                            <>
                                <h2 className="ad-details-title">Modifier {props.title}</h2>
                                <AdForm 
                                action="Patch"
                                id={props.id}
                                title={props.title}
                                description={props.description}
                                owner={props.owner}
                                price={props.price}
                                picture={props.picture}
                                location={props.location}
                                categoryId={props.category.id}/>
                            </>
                            }
                    </div>
                </Flipped>
            </Flipper>
        </main>
    )
}
export default AdDetail;