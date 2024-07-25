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

export const deleteOldFiles = async () => {
  // Planification cron pour s'exécuter tous les jours à minuit
  cron.schedule("30 0 * * *", async () => {
    // Définir la date de seuil (3 mois en arrière)
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 6);

    try {
      // Trouver les fichiers qui ont été téléchargés il y a plus de trois mois
      const oldFiles = await File.createQueryBuilder("file")
          .where("file.uploadAt < :threeMonthsAgo", { threeMonthsAgo })
          .getMany();

      // Configurer le client AWS S3
      const awsBucket = new AWS.S3(localSetupMinio);

      // Supprimer les fichiers de la base de données et du stockage MinIO/S3
      for (const file of oldFiles) {
        console.log(`Suppression du fichier ${file.uniqueName}`);

        try {
          // Supprimer le fichier du bucket MinIO/S3
          const delParams = {
            Bucket: "bucket-filehub",
            Key: file.uniqueName,
          };

          await awsBucket.deleteObject(delParams).promise();

          // Supprimer le fichier de la base de données
          await File.delete(file.id);
        } catch (err) {
          console.error(
              `Une erreur s'est produite lors de la suppression du fichier ${file.uniqueName} : ${err}`
          );
        }
      }
    } catch (err) {
      console.error(
          `Une erreur s'est produite lors de la récupération des fichiers anciens : ${err}`
      );
    }
  });
};
