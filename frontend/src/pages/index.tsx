import React from "react";
import { useRouter } from "next/router";
import Header from "@/layout/Header";
import FileListItem from "@/components/FileList";
import { margin } from "@mui/system";

const Home: React.FC = () => {
    const router = useRouter();

    const files = [
        { name: 'Fichier1.txt', addedDate: '2024-02-02', expirationDate: '2024-05-02', link: '/path/to/file1' },
        { name: 'Fichier2.txt', addedDate: '2024-02-02', expirationDate: '2024-05-02', link: '/path/to/file2' },
        // Ajoutez d'autres fichiers selon vos besoins
    ];

    return (
        <>
            <Header />
            <div style={{ marginTop: '70px' }}> {/* Ajustez la hauteur en fonction de votre header */}
                <FileListItem files={files} />
            </div>
        </>
    );
};

export default Home;
