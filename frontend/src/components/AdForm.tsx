import { FormEvent, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "@apollo/client";
import { queryAllCategories, mutationUpdateAd, mutationCreateAd } from "@/query&mutations";
import { AdFormProps, CategoryProps } from "@/types";

const AdForm = (props: AdFormProps): React.ReactNode => {
    const router = useRouter();
    const [categories, setCategories] = useState<CategoryProps[]>([]);
    const [message, setMessage] = useState("");

    const [title, setTitle] = useState(props.title);
    const [description, setDescription] = useState(props.description);
    const [owner, setOwner] = useState(props.owner);
    const [price, setPrice] = useState(props.price);
    const [picture, setPicture] = useState(props.picture);
    const [location, setLocation] = useState(props.location);
    const [category, setCategory] = useState(props.categoryId);

    const { loading, error, data } = useQuery(queryAllCategories);
    const [doCreate] = useMutation(mutationCreateAd);
    const [doUpdate] = useMutation(mutationUpdateAd);

    async function createAd() {
        await doCreate({
          variables: {
            data: {
                title: title,
                description: description,
                owner: owner,
                price: price,
                picture: picture,
                location: location,
                category: {
                  id: category
                }
            }
          },
        });
        router.push(`/`);
    }

    async function updateAd() {
        await doUpdate({
          variables: {
            data: {
                title: title,
                description: description,
                owner: owner,
                price: price,
                picture: picture,
                location: location,
                category: {
                  id: category
                }
            },
            updateAdId: props.id
          }
        });
    }

    useEffect(()=>{
        if (!loading){
            setCategories(data.allCategories);
        }
    }, [loading]);

    const submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (props.action === "Post") {
            console.log("action = Post");
            createAd();
        } else if (props.action === "Patch") {
            console.log("action = Patch");
            updateAd();
        }
    }
    
    return (
        <form onSubmit={submit}>
            <label>
                Titre de l'annonce <br />
                <input type="text" className="text-field" name="title" value={title}
                onChange={e => setTitle(e.target.value)} /><br />
            </label>
            <label>
                Description de l'annonce <br />
                <input type="text" className="text-field" name="description" value={description}
                onChange={e => setDescription(e.target.value)}/><br />
            </label>
            <label>
                Créateur de l'annonce <br />
                <input type="text" className="text-field" name="owner" value={owner}
                onChange={e => setOwner(e.target.value)}/><br />
            </label>
            <label>
                Prix de vente <br />
                <input type="number" className="text-field" name="price" value={price}
                onChange={e => setPrice(Number(e.target.value))}/><br />
            </label>
            <label>
                URL de l'image <br />
                <input type="text" className="text-field" name="picture" value={picture}
                onChange={e => setPicture(e.target.value)}/><br />
            </label>
            <label>
                Localisation <br />
                <input type="text" className="text-field" name="location" value={location}
                onChange={e => setLocation(e.target.value)}/><br />
            </label>
            <label>
                Catégorie <br />
                <select name="category" className="text-field" value={category} onChange={e => setCategory(Number(e.target.value))}>
                    {categories.map((category)=>(
                        <option value={category.id} key={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </label>
            <button className="button button-primary">Submit</button>
            <p>{message}</p>
        </form>
    )
}
export default AdForm;