export const formatTimestampDate = (timestamp: string): string => {
  // Créer un objet Date à partir du timestamp
  const date = new Date(timestamp);

  // Extrait le jour, le mois et l'année de la date
  const day = date.getDate();
  const month = date.getMonth() + 1; // renvoi un nombre compris entre 0 et 11, donc on ajoute 1 pour avoir la bonne date
  const year = date.getFullYear();

  // Formater la date avec des zéros de remplissage si nécessaire
  const formattedDay = day < 10 ? `0${day}` : day;
  const formattedMonth = month < 10 ? `0${month}` : month;

  return `${formattedDay}/${formattedMonth}/${year}`;
};
