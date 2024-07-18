import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { TableVirtuoso, TableComponents } from "react-virtuoso";
import { formatTimestampDate } from "@/helpers/Date";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import DownloadIcon from "@mui/icons-material/Download";
import { Tooltip, IconButton, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useApolloClient, useMutation, useQuery } from "@apollo/client";
import { mutationDeleteFile } from "@/graphql/mutationDeleteFile";
import axios from "axios";
import { queryMe } from "@/graphql/queryMe";
import { getUserFiles } from "@/graphql/getUserFiles";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { API_URL } from "@/config";

interface FileData {
  id: string;
  originalName: string;
  uniqueName: string;
  uploadAt: string;
  expirationDate: string;
  url: string;
}

interface ColumnData {
  label: string;
  width: number;
}

const columns: ColumnData[] = [
  {
    width: 80,
    label: "Date d'ajout",
  },
  {
    width: 110,
    label: "Nom du fichier",
  },
  {
    width: 110,
    label: "Date d'expiration",
  },
  {
    width: 65,
    label: "Télécharger",
  },
  {
    width: 65,
    label: "Copier",
  },
  {
    width: 65,
    label: "Ouvrir",
  },
  {
    width: 65,
    label: "Supprimer",
  },
];

const VirtuosoTableComponents: TableComponents<FileData> = {
  // eslint-disable-next-line react/display-name
  Scroller: React.forwardRef<HTMLDivElement>((props, ref) => (
    <TableContainer {...props} ref={ref} />
  )),
  Table: (props) => (
    <Table
      {...props}
      sx={{
        borderCollapse: "collapse",
        tableLayout: "fixed",
      }}
    />
  ),
  TableHead,
  TableRow: ({ item: _item, ...props }) => <TableRow {...props} />,

  // eslint-disable-next-line react/display-name
  TableBody: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
    <TableBody {...props} ref={ref} />
  )),
};

export function fixedHeaderContent() {
  return (
    <TableRow>
      {columns.map((column, index) => (
        <TableCell
          key={index}
          variant="head"
          align={
            ["Télécharger", "Copier", "Ouvrir", "Supprimer"].includes(
              column.label,
            )
              ? "center"
              : "right"
          }
          style={{ width: column.width }}
          sx={{
            backgroundColor: "background.paper",
            fontWeight: 700,
          }}
        >
          {column.label}
        </TableCell>
      ))}
    </TableRow>
  );
}

function rowContent(
  _index: number,
  row: FileData,
  deleteFile: (fileId: FileData["id"]) => void,
) {
  const calculateExpirationDate = (uploadDate: string): string => {
    const expirationDate = new Date(uploadDate);
    expirationDate.setMonth(expirationDate.getMonth() + 6);
    return formatTimestampDate(expirationDate.toISOString());
  };

  const isImageOrPdf = (fileName: string) => {
    const fileExtension = fileName.split(".").pop()?.toLowerCase();
    return ["pdf", "jpg", "jpeg", "png", "gif", "bmp", "webp", "tiff"].includes(
      fileExtension || "",
    );
  };

  const downloadFile = async () => {
    try {
      const response = await axios.get(`${API_URL}/download`, {
        params: {
          name: row.uniqueName,
        },
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", row.originalName);
      document.body.appendChild(link);
      link.click();
      toast.success("Fichier téléchargé avec succès!");
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Problème lors du téléchargement...");
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(row.url);
    toast.success("Lien copié avec succès!");
  };

  const openFile = async () => {
    try {
      const response = await axios.get(`${API_URL}/download`, {
        params: {
          name: row.uniqueName,
        },
        responseType: "blob",
      });

      const file = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const fileUrl = URL.createObjectURL(file);

      window.open(fileUrl, "_blank");
      //Rajouter le fait de pouvoir ouvrir le fichier dans un google doc viewer quand on aura le temps
    } catch (error) {
      console.error("Error opening file:", error);
      toast.error("Problème lors de l'ouverture du fichier...");
    }
  };

  return (
    <>
      <TableCell align="right">{formatTimestampDate(row.uploadAt)}</TableCell>
      <TableCell
        align="right"
        sx={{
          whiteSpace: "normal",
          wordWrap: "break-word",
          overflowWrap: "break-word",
          maxWidth: 150,
        }}
      >
        {row.originalName}
      </TableCell>
      <TableCell align="right">
        {calculateExpirationDate(row.uploadAt)}
      </TableCell>
      <TableCell align="center">
        <Tooltip title="Télécharger">
          <IconButton sx={{ color: "#FF544F" }} onClick={downloadFile}>
            <DownloadIcon />
          </IconButton>
        </Tooltip>
      </TableCell>
      <TableCell align="center">
        <Tooltip title="Copier le lien">
          <IconButton sx={{ color: "#FF544F" }} onClick={handleCopyLink}>
            <InsertLinkIcon />
          </IconButton>
        </Tooltip>
      </TableCell>
      {isImageOrPdf(row.originalName) ? (
        <TableCell align="center">
          <Tooltip title="Ouvrir">
            <IconButton sx={{ color: "#FF544F" }} onClick={openFile}>
              <OpenInNewIcon />
            </IconButton>
          </Tooltip>
        </TableCell>
      ) : (
        <TableCell></TableCell>
      )}
      <TableCell align="center">
        <Tooltip title="Supprimer">
          <IconButton
            sx={{ color: "#FF544F" }}
            onClick={() => deleteFile(row.id)}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </TableCell>
    </>
  );
}

export default function FileList() {
  const [doDeleteFile, { error: deleteFileError }] = useMutation(
    mutationDeleteFile,
    {
      refetchQueries: [getUserFiles],
    },
  );

  const {
    loading: meLoading,
    error: meError,
    data: meData,
  } = useQuery(queryMe);
  const userId = meData?.me?.id;

  const deleteFile = async (fileId: FileData["id"]) => {
    await doDeleteFile({
      variables: {
        id: fileId,
      },
    });

    if (!deleteFileError) {
      toast.success("Fichier supprimé avec succès!");
    } else {
      toast.error("Problème lors de la suppression...");
    }
  };

  const { loading, error, data } = useQuery(getUserFiles, {
    variables: { userId },
    skip: !userId,
  });

  const client = useApolloClient();

  useEffect(() => {
    client.refetchQueries({
      include: [getUserFiles],
    });
  }, [client]);

  if (meLoading) return <p>Loading...</p>;
  if (meError) return <p>Error: {meError.message}</p>;

  return (
    <>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : (
        <>
          {data.filesCurrentUser.length === 0 ? (
            <Typography>
              Tous les fichiers que vous avez envoyés apparaîtront ici
            </Typography>
          ) : (
            <Paper
              sx={{
                height: 280,
                width: "90%",
                maxWidth: "1000px",
                boxShadow: "none",
                marginBottom: "15px",
              }}
            >
              <TableVirtuoso
                data={data.filesCurrentUser}
                components={VirtuosoTableComponents}
                fixedHeaderContent={fixedHeaderContent}
                itemContent={(index, row) => rowContent(index, row, deleteFile)}
              />
            </Paper>
          )}
        </>
      )}
    </>
  );
}
