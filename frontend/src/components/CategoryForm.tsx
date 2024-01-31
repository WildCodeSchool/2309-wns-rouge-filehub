import { FormEvent, useState } from "react";
import { useRouter } from "next/router";
import { useMutation } from "@apollo/client";
import { mutationUpdateCategory, mutationCreateCategory } from "@/query&mutations";
import { CategoryFormProps } from "@/types";

const CategoryForm = (props: CategoryFormProps): React.ReactNode => {
    const router = useRouter();
    const [message, setMessage] = useState("");

    const [name, setName] = useState(props.name);

    const [doCreate] = useMutation(mutationCreateCategory);
    const [doUpdate] = useMutation(mutationUpdateCategory);

    async function createCategory() {
        await doCreate({
          variables: {
            data: {
                name: name
            }
          },
        });
        router.push(`/`);
    }

    async function updateCategory() {
        await doUpdate({
          variables: {
            data: {
                name: name
            },
            updateCategoryId: props.id
          }
        });
    }

    const submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (props.action === "Post") {
            console.log("action = Post");
            createCategory();
        } else if (props.action === "Patch") {
            console.log("action = Patch");
            updateCategory();
        }
    }
    
    return (
        <form onSubmit={submit}>
            <label>
                Nom de la Catégorie<br />
                <input type="text" className="text-field" name="title" value={name}
                onChange={e => setName(e.target.value)} /><br />
            </label>
            <button className="button button-primary">Submit</button>
            <p>{message}</p>
        </form>
    )
}
export default CategoryForm;