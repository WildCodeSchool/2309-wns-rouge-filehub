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
import DownloadIcon from "@mui/icons-material/Download";
import { Tooltip, IconButton, Stack, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useApolloClient, useMutation, useQuery } from "@apollo/client";
import { mutationDeleteFile } from "@/graphql/mutationDeleteFile";
import axios from "axios";
import { queryMe } from "@/graphql/queryMe";
import { getUserFiles } from "@/graphql/getUserFiles";
import { useEffect } from "react";

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

function fixedHeaderContent() {
  return (
    <TableRow>
      {columns.map((column, index) => (
        <TableCell
          key={index}
          variant="head"
          align={
            ["Télécharger", "Copier", "Supprimer"].includes(column.label)
              ? "center"
              : "right"
          }
          style={{ width: column.width }}
          sx={{
            backgroundColor: "background.paper",
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

  const downloadFile = async () => {
    try {
      const response = await axios.get("http://localhost:5001/download", {
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
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(row.url);
  };

  return (
    <>
      <TableCell align="right">{formatTimestampDate(row.uploadAt)}</TableCell>
      <TableCell align="right">
        {row.originalName.length > 10
          ? row.originalName.substring(0, 20) + "..."
          : row.originalName}
      </TableCell>
      <TableCell align="right">
        {calculateExpirationDate(row.uploadAt)}
      </TableCell>
      <TableCell align="center">
        <Tooltip title="Télécharger">
          <IconButton sx={{ color: "orange" }} onClick={downloadFile}>
            <DownloadIcon />
          </IconButton>
        </Tooltip>
      </TableCell>
      <TableCell align="center">
        <Tooltip title="Copier le lien">
          <IconButton sx={{ color: "orange" }} onClick={handleCopyLink}>
            <InsertLinkIcon />
          </IconButton>
        </Tooltip>
      </TableCell>
      <TableCell align="center">
        <Tooltip title="Supprimer">
          <IconButton
            sx={{ color: "orange" }}
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
  const [doDeleteFile] = useMutation(mutationDeleteFile, {
    refetchQueries: [getUserFiles],
  });

  const deleteFile = async (fileId: FileData["id"]) => {
    await doDeleteFile({
      variables: {
        id: fileId,
      },
    });
  };

  const {
    loading: meLoading,
    error: meError,
    data: meData,
  } = useQuery(queryMe);
  const userId = meData?.me?.id;

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
  );
}
