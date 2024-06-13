import React, { useEffect } from "react";
import { useRouter } from "next/router";
import 'react-toastify/dist/ReactToastify.css';
import { useMutation } from "@apollo/client";
import { mutationVerifyAccount } from "@/graphql/mutationVerifyAccount";
import { Typography, Box, CircularProgress } from "@mui/material";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { FilehubIcon } from "@/styles/icon/FileHubIcon";

export default function VerifyAccount() {
    const router = useRouter();
    const token = router.query.token;
    console.log(token);
    const [verifyAccount, {data, loading, error}] = useMutation(mutationVerifyAccount);
    
    useEffect(()=>{
        try{
            verifyAccount({variables: { token: token }});
        }catch(e){
            console.log(e);
        }
        
    }, [])

    return (
        <>
            <Box sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                height: "100vh"
            }}>
                <FilehubIcon style={{ width: 300, height: "auto", marginBottom: 25 }} />
                {loading && <>
                    <Typography variant="h4" align="center" gutterBottom>
                        Vérification du compte ...
                    </Typography>
                    <CircularProgress color='info' />
                </>}
                {error && !loading && <>
                    <Typography variant="h4" align="center" gutterBottom>
                        Une erreur est survenue ...
                    </Typography>
                    <ErrorOutlineIcon color='error' sx={{
                        width: 50,
                        height: 50
                    }} />
                </>}
                {data && !loading && !error && <>
                    <Typography variant="h4" align="center" gutterBottom>
                        Compte vérifié avec succès !
                    </Typography>
                    <CheckCircleOutlineIcon color='success' />
                </>}
            </Box>
        </>
    );
}