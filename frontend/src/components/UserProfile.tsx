import { Button, TextField } from "@mui/material";
import { useState } from "react";
import styled from "styled-components";
import { theme } from "@/styles/theme";

const UserProfileContent = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
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
    height: 25px;
    margin: 2px 0;
    border: 1px solid ${theme.palette.secondary.main};
    border-radius: 50px;
    padding: 2vmin 0 2vmin 5%;
`

const InputField = styled(TextField)`
    & .MuiOutlinedInput-root{
        height: 55px;
        margin: 2px 0;
        border-radius: 55px;
        padding: 2vmin 0 2vmin 5%;
    }
`

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
        position: relative;
        background: linear-gradient(90deg, rgba(250,209,38,1) 0%, rgba(255,84,79,1) 75%, rgba(255,84,79,1) 100%);;
        color: white;
        border-radius: 50px;
        padding: 0;
        display: flex;
        justify-content: center;
        text-transform: none;
        width: 95%;
        height: 50px;
        margin: 2vmin 0 0 0;
    }
`;

const DivLoadFile = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50vmin;
`

const ButtonSVGContainer = styled.div`
    position: absolute;
    right: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: white;
    border-radius: 100%;
    height: 40px;
    width: 40px;
`

function UserProfile(): React.ReactNode {
    const [toggleModif, setToggleModif] = useState(false);
    const [email, setEmail] = useState("Wilder@Wild.com");
    const [passWord, setPassWord] = useState("");
    const [newPassWord, setNewPassWord] = useState("");
    const [secNewPassWord, setSecNewPassWord] = useState("");

    const changePassword = ()=>{
        console.log(passWord);
        console.log(newPassWord);
        console.log(secNewPassWord);
        setPassWord("");
        setNewPassWord("");
        setSecNewPassWord("");
        setToggleModif(!toggleModif);
    }

    return (
        <UserProfileContent>
            <UserInfo>
                <Title>Information de mon compte</Title>
                <Label>
                    <FieldTitle>Email :</FieldTitle>
                    <Field>{email}</Field>
                </Label>
                {toggleModif ? 
                <>
                    <Label>
                        <InputField label="Password" variant="outlined" 
                        helperText="Entrez votre mot de passe actuel" type="password" value={passWord} 
                        onChange={(e)=>setPassWord(e.target.value)}/>

                        <InputField label="New Password" variant="outlined" 
                        helperText="Entrez votre nouveau mot de passe" type="password" value={newPassWord} 
                        onChange={(e)=>setNewPassWord(e.target.value)}/>
                        
                        <InputField label="New Password" variant="outlined" 
                        helperText="Confirmez votre nouveau mot de passe" type="password" 
                        value={secNewPassWord} onChange={(e)=>setSecNewPassWord(e.target.value)}/>
                    </Label>
                </>
                :
                    <Label>
                        <FieldTitle>Mot de passe :</FieldTitle>
                        <Field>As if we would show it</Field>
                    </Label>
                }
                {toggleModif ? <>
                <ButtonConfirm onClick={changePassword}>
                    Confirmer
                </ButtonConfirm>
                <ButtonText onClick={()=>setToggleModif(!toggleModif)}>
                    Abandon
                </ButtonText></> 
                :
                <ButtonText onClick={()=>setToggleModif(!toggleModif)}>
                    Modifier mon mot de passe
                </ButtonText>
                }
            </UserInfo>
            <DivLoadFile>
                <ButtonConfirm onClick={()=>{console.log("charger un fichier")}}>
                    Charger un nouveau fichier
                    <ButtonSVGContainer>
                        <svg width="40%" height="40%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g id="Interface / Download">
                                <path id="Vector" d="M6 21H18M12 3V17M12 17L17 12M12 17L7 12" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </g>
                        </svg>
                    </ButtonSVGContainer>
                </ButtonConfirm>
            </DivLoadFile>
        </UserProfileContent>
    )
}

export default UserProfile;