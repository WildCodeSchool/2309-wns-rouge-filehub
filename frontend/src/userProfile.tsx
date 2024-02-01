import { useRouter } from "next/router";
import { useState } from "react";


function UserProfile(): React.ReactNode {
    const router = useRouter();
    const [toggleModif, setToggleModif] = useState(false);
    const [email, setEmail] = useState("EMAIL");
    const [passWord, setPassWord] = useState("PASSWORD");

    return (
        <>
            <div>
                <p>Information de mon compte</p>
                <label>
                    <p>eMail :</p>
                    <p>{email}</p>
                </label>
                <label>
                    <p>Mot de passe :</p>
                    {!toggleModif ? 
                    <>
                        <p>{passWord}</p>
                        <button onClick={() =>setToggleModif(true)}>
                            Modifier mon mot de passe
                        </button>
                    </>
                    :
                    <>
                        <input type="text" value={passWord} onChange={(e)=>setPassWord(e.target.value)}/>
                        <button  onClick={() => setToggleModif(false)}>
                            Confirmer
                        </button>
                    </>}
                </label>
                <input type="file"/>
            </div>
        </>
    )
}

export default UserProfile;