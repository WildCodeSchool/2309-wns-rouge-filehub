import { Button } from "@mui/material";
import { useState } from "react";
import styled from "styled-components";
import { theme } from "@/styles/theme";

const ButtonText = styled(Button)`
    &.MuiButtonBase-root{
        color: ${theme.palette.secondary.main};
        border-radius: 50px;
        padding: 0;
        display: flex;
        justify-content: left;
        text-transform: none;
        width: 100%;
    }
`;

const ButtonConfirm = styled(Button)`
    &.MuiButtonBase-root{
        background: linear-gradient(90deg, rgba(250,209,38,1) 0%, rgba(255,84,79,1) 75%, rgba(255,84,79,1) 100%);;
        color: white;
        border-radius: 50px;
        padding: 0;
        display: flex;
        justify-content: center;
        text-transform: none;
        width: 95%;
        margin: 1vmin 0 0 0;
        padding: 1vmin 0 1vmin 5%;
    }
`;

const UserInfo = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 5vmin 15vmin 8vmin 15vmin;
    border: 1px solid ${theme.palette.secondary.main};
    border-radius: 5vmin;
    width: 50vmin;
    height: max(50vmin, fit-content);
    color: ${theme.palette.primary.main};
`;

const Title = styled.h2`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
`

const Label = styled.label`
    display: flex;
    justify-content: center;
    flex-direction: column;
    width: 100%;
    font-size: 2.5vmin;
    margin: 8% 0 0 0;
`

const FieldTitle = styled.p`
    width: 100%;
    margin: 0;
`

const Field = styled.p`
    width: 95%;
    margin: 2px 0;
    border: 1px solid ${theme.palette.secondary.main};
    border-radius: 50px;
    padding: 2vmin 0 2vmin 5%;
`

const InputField = styled.input`
    width: 95%;
    margin: 2px 0;
    border: 1px solid ${theme.palette.secondary.main};
    border-radius: 50px;
    padding: 2vmin 0 2vmin 5%;
    &::placeholder{
        color: ${theme.palette.secondary.main};
    }
`

function UserProfile(): React.ReactNode {
    const [toggleModif, setToggleModif] = useState(false);
    const [email, setEmail] = useState("Wilder@Wild.com");
    const [passWord, setPassWord] = useState("");
    const [newPassWord, setNewPassWord] = useState("");
    const [secNewPassWord, setSecNewPassWord] = useState("");


    return (
        <>
            <UserInfo>
                <Title>Information de mon compte</Title>
                <Label>
                    <FieldTitle>Email :</FieldTitle>
                    <Field>{email}</Field>
                </Label>
                {toggleModif ? 
                <>
                    <Label>
                        <FieldTitle>Entrez votre mot de passe :</FieldTitle>
                        <InputField type="password" value={passWord} placeholder="Password"
                        onChange={(e)=>setPassWord(e.target.value)}/>
                    </Label>
                    <Label>
                        <FieldTitle>Entrez votre nouveau mot de passe :</FieldTitle>
                        <InputField type="password" value={newPassWord} placeholder="New password"
                        onChange={(e)=>setNewPassWord(e.target.value)}/>
                        <FieldTitle>Entrez le une seconde fois :</FieldTitle>
                        <InputField type="password" value={secNewPassWord} placeholder="New password"
                        onChange={(e)=>setSecNewPassWord(e.target.value)}/>
                    </Label>
                </>
                :
                    <Label>
                        <FieldTitle>Mot de passe :</FieldTitle>
                        <Field>As if we would show it</Field>
                    </Label>
                }
                {toggleModif ? 
                <ButtonConfirm onClick={()=>setToggleModif(!toggleModif)}>
                    Confirmer
                </ButtonConfirm>
                :
                <ButtonText onClick={()=>setToggleModif(!toggleModif)}>
                    Modifier mon mot de passe
                </ButtonText>
                }
                
            </UserInfo>
        </>
    )
}

export default UserProfile;