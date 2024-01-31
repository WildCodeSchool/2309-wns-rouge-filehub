import { FormEvent, useState } from "react";
import { mutationSignUp } from "@/query&mutations";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/router";

const signUp = (): React.ReactNode => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [doSignUp, {error: signUpError}] = useMutation(mutationSignUp);
    
    const submit = async (e: FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        try{
            const { data } = await doSignUp({
                variables: {
                    data: {
                        email: email,
                        password: password
                    }
                  }
            })
            if(data.signUp){
                router.replace("/signIn");
            }
        } catch {
            console.log("une erreur est survenue");
        }
    }

    return (
        <form onSubmit={submit}>
            <h2>Création de profil</h2>
            {signUpError ? <p>une erreur est survenue</p> : null}
            <input type="email" className="text-field" onChange={(e)=>setEmail(e.target.value)}/>
            <input type="password" className="text-field" onChange={(e)=>setPassword(e.target.value)}/>
            <button type="submit" className="button button-primary">SignUp</button>
        </form>
    )
}
export default signUp;