import cron from "node-cron";
import { File } from "../entities/File";
import AWS from "aws-sdk";

const localSetupMinio = {
    endpoint: process.env.MINIO_ENDPOINT,
    accessKeyId: process.env.MINIO_ROOT_USER,
    secretAccessKey: process.env.MINIO_ROOT_PASSWORD,
    sslEnabled: false,
    s3ForcePathStyle: true,
};

export const deleteOrphanFiles = async()=> {

    cron.schedule('0 0 * * *', async () => {
        const filesDB = await File.find();
        const awsBucket = new AWS.S3(localSetupMinio);
        const params = {
            Bucket: "bucket-filehub"
        };
        let files = (await awsBucket.listObjectsV2(params).promise()).Contents;

        if(files){
            for (let i = 0; i < files.length; i++) {
                let check = false;
                // pour chaque fichier dans le bucket :
                // On verifie si le fichier aparait dans la BDD (uniqueName)
                for (let y = 0; y < filesDB.length; y++) {
                    if(files[i].Key === filesDB[y]?.uniqueName){
                        check = true;
                    }
                }
                // si il n'y apparaît pas, on le supprime car orphelin
                if(!check){
                    console.log(`Destruction du fichier ${files[i]}`);
                    try {
                        const delParams = {
                          Bucket: "bucket-filehub",
                          Key: files[i].Key || "",
                        };
                
                        await awsBucket.deleteObject(delParams).promise();
                    } catch (err) {
                        throw new Error(
                          `Une erreur s'est produite lors de la suppression du fichier : ${err}`,
                        );
                    }
                }
            }
        }
    });
}