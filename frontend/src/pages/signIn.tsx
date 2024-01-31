import { FormEvent, useState } from "react";
import { mutationSignIn, queryMe } from "@/query&mutations";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/router";

const signIn = (): React.ReactNode => {
    const router = useRouter();
    const [email, setEmail] = useState('test.test@gmail.com');
    const [password, setPassword] = useState('test');
    const [failed, setFailed] = useState(false);
    const [doSignIn, {error: signInError}] = useMutation(mutationSignIn, {
        refetchQueries: [queryMe]
    });
    
    const submit = async (e: FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        setFailed(false);
        try{
            const { data } = await doSignIn({
                variables: {
                    data: {
                        email: email,
                        password: password
                    }
                  }
            })
            if(data.signIn){
                router.replace("/");
            } else {
                setFailed(true);
            }
        } catch {
            console.log("une erreur est survenue");
        }
    }

    return (
        <>
            <form onSubmit={submit}>
                <h2>Connexion</h2>
                {signInError ? <p>une erreur est survenue</p> : null}
                {failed ? <p>connexion échouée</p> : null}
                <input type="email" className="text-field" onChange={(e)=>setEmail(e.target.value)} 
                defaultValue={email}/>
                <input type="password" className="text-field" onChange={(e)=>setPassword(e.target.value)} 
                defaultValue={password}/>
                <button type="submit" className="button button-primary">Connexion</button>
            </form>
            <h3>Pas de profil?</h3>
            <button className="button link-button" onClick={()=>{router.push("/signUp")}}>En créer un</button>
        </>
    )
}
export default signIn;