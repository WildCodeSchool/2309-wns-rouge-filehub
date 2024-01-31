import { FormEvent, useState } from "react";
import { useRouter } from "next/router";
import { useMutation } from "@apollo/client";
import { mutationUpdateTag, mutationCreateTag } from "@/query&mutations";
import { TagFormProps } from "@/types";

const TagForm = (props: TagFormProps): React.ReactNode => {
    const router = useRouter();
    const [message, setMessage] = useState("");

    const [name, setName] = useState(props.name);

    const [doCreate] = useMutation(mutationCreateTag);
    const [doUpdate] = useMutation(mutationUpdateTag);

    async function createTag() {
        await doCreate({
          variables: {
            data: {
                name: name
            }
          },
        });
        router.push(`/`);
    }

    async function updateTag() {
        await doUpdate({
          variables: {
            data: {
                name: name
            },
            updateTagId: props.id
          }
        });
    }

    const submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (props.action === "Post") {
            console.log("action = Post");
            createTag();
        } else if (props.action === "Patch") {
            console.log("action = Patch");
            updateTag();
        }
    }
    
    return (
        <form onSubmit={submit}>
            <label>
                Nom du Tag <br />
                <input type="text" className="text-field" name="title" value={name}
                onChange={e => setName(e.target.value)} /><br />
            </label>
            <button className="button button-primary">Submit</button>
            <p>{message}</p>
        </form>
    )
}
export default TagForm;