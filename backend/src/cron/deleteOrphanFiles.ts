import cron from "node-cron";
import fs from 'fs';
import { File } from "../entities/File";

const filesFolderPath = '/app/src/Files';

export const deleteOrphanFiles = async()=> {

    cron.schedule('0 0 * * *', async () => {
        const filesDB = await File.find();
        fs.readdir(filesFolderPath, (err, files) => {
            if (err) {
              console.error('Erreur lors de la lecture du dossier :', err);
              return;
            }
            for (let i = 0; i < files.length; i++) {
                let check = false;
                // pour chaque fichier dans le dossier Files :
                // On verifie si le fichier aparait dans la BDD (uniqueName)
                for (let y = 0; y < filesDB.length; y++) {
                    if(files[i] === filesDB[y]?.uniqueName){
                        check = true;
                    }
                }
                // si il n'y apparaît pas, on le supprime car orphelin
                if(!check){
                    console.log(`Destruction du fichier ${files[i]}`);
                    fs.unlink(`${filesFolderPath}/${files[i]}`, (err) => {
                        if (err) {
                            console.error(`Erreur lors de la suppression du fichier ${files[i]} :`, err);
                            return;
                        }
                        console.log(`Le fichier ${files[i]} a été supprimé avec succès.`);
                    });
                }
            }
        });
    });
}