import React, { useEffect } from "react";
import { useRouter } from "next/router";
import 'react-toastify/dist/ReactToastify.css';
import { useMutation } from "@apollo/client";
import { mutationVerifyAccount } from "@/graphql/mutationVerifyAccount";
import { Typography, Box, CircularProgress } from "@mui/material";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { FilehubIcon } from "@/styles/icon/FileHubIcon";
import { theme } from "@/styles/theme";

export default function VerifyAccount() {
    const router = useRouter();
    const token = router.query.token;
    const [verifyAccount, {data, loading, error}] = useMutation(mutationVerifyAccount);

    const handleVerifyAccount = async ()=>{
        try{
            if(typeof token === 'string'){
                await verifyAccount({variables: { token: token }});
            }
        }catch(e){
            console.log(e);
        }
    }
    
    useEffect(()=>{
        handleVerifyAccount();
    }, [token])

    useEffect(()=>{
        if(data && !error && !loading){
            setTimeout(()=>{
                router.replace("/login");
            }, 4000);
        }
    }, [data])

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
                        Une erreur est survenue :
                    </Typography>
                    <Typography variant="h6" align="center" sx={{
                        color: theme.palette.secondary.main,
                        fontWeight: 'bold'
                    }} gutterBottom>
                        {error.message}
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
                    <Typography variant="h6" align="center" sx={{
                        color: "green",
                        fontWeight: 'bold'
                    }} gutterBottom>
                        Redirection...
                    </Typography>
                    <CheckCircleOutlineIcon color='success' />
                </>}
            </Box>
        </>
    );
}