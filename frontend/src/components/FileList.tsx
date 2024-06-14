import * as React from "react";
import { useEffect, useState } from "react";
import { Paper, Tooltip, IconButton, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridSortModel } from "@mui/x-data-grid";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import { useApolloClient, useMutation, useQuery } from "@apollo/client";
import axios from "axios";
import { toast } from "react-toastify";
import { formatTimestampDate } from "@/helpers/Date";
import { API_URL } from "@/config";
import { mutationDeleteFile } from "@/graphql/mutationDeleteFile";
import { queryMe } from "@/graphql/queryMe";
import { getUserFiles } from "@/graphql/getUserFiles";

interface File {
  id: string;
  originalName: string;
  uniqueName: string;
  uploadAt: string;
  expirationDate: string;
  url: string;
}

interface FilesData {
  filesCurrentUser: { files: File[]; total: number };
}

const calculateExpirationDate = (uploadDate: string): string => {
  const expirationDate = new Date(uploadDate);
  expirationDate.setMonth(expirationDate.getMonth() + 6);
  return formatTimestampDate(expirationDate.toISOString());
};

const downloadFile = async (file: File) => {
  try {
    const response = await axios.get(`${API_URL}/download`, {
      params: { name: file.uniqueName },
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", file.originalName);
    document.body.appendChild(link);
    link.click();
    link.parentNode!.removeChild(link);
    toast.success("Fichier téléchargé avec succès!");
  } catch (error) {
    console.error("Error downloading file:", error);
    toast.error("Problème lors du téléchargement...");
  }
};

const handleCopyLink = (file: File) => {
  navigator.clipboard.writeText(file.url);
  toast.success("Lien copié avec succès!");
};

const FileList = () => {
  const {
    loading: meLoading,
    error: meError,
    data: meData,
  } = useQuery(queryMe);
  const userId = meData?.me?.id;

  const [pageSize, setPageSize] = useState(5);
  const [page, setPage] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [sortModel, setSortModel] = useState<String>("desc");

  const { loading, error, data, refetch } = useQuery(getUserFiles, {
    variables: {
      limit: pageSize,
      offset: page * pageSize,
      sortOrder: sortModel,
    },
    skip: !userId,
  });
  console.log(data, data);

  const [doDeleteFile, { error: deleteFileError }] = useMutation(
    mutationDeleteFile,
    {
      refetchQueries: [getUserFiles],
    },
  );

  const client = useApolloClient();

  useEffect(() => {
    client.refetchQueries({
      include: [getUserFiles],
    });
  }, [client]);

  useEffect(() => {
    if (userId) {
      refetch();
    }
  }, [page, pageSize, sortModel, userId]);

  if (meLoading) return <p>Loading...</p>;
  if (meError) return <p>Error: {meError.message}</p>;

  const handleDeleteFile = async (fileId: string) => {
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

  const handlePageChange = (params: any) => {
    setPage(params.page);
    refetch({
      limit: pageSize,
      offset: params.page * pageSize,
      sortOrder: sortModel,
    });
  };

  const columns: GridColDef[] = [
    {
      field: "addDate",
      headerName: "Date d'ajout",
      disableColumnMenu: true,
      flex: 1,
      align: "center",
      headerAlign: "center",
      resizable: false,
    },
    {
      field: "originalName",
      headerName: "Nom du fichier",
      sortable: false,
      disableColumnMenu: true,
      flex: 1,
      align: "center",
      headerAlign: "center",
      resizable: false,
    },
    {
      field: "expirationDate",
      headerName: "Date d'expiration",
      sortable: false,
      disableColumnMenu: true,
      flex: 1,
      align: "center",
      headerAlign: "center",
      resizable: false,
    },
    {
      field: "download",
      headerName: "Télécharger",
      sortable: false,
      disableColumnMenu: true,
      flex: 1,
      align: "center",
      headerAlign: "center",
      resizable: false,
      renderCell: (params) => (
        <Tooltip title="Télécharger">
          <IconButton
            sx={{ color: "#FF544F" }}
            onClick={() => downloadFile(params.row)}
          >
            <DownloadIcon />
          </IconButton>
        </Tooltip>
      ),
    },
    {
      field: "copy",
      headerName: "Copier",
      sortable: false,
      disableColumnMenu: true,
      flex: 1,
      align: "center",
      headerAlign: "center",
      resizable: false,
      renderCell: (params) => (
        <Tooltip title="Copier le lien">
          <IconButton
            sx={{ color: "#FF544F" }}
            onClick={() => handleCopyLink(params.row)}
          >
            <InsertLinkIcon />
          </IconButton>
        </Tooltip>
      ),
    },
    {
      field: "delete",
      headerName: "Supprimer",
      sortable: false,
      disableColumnMenu: true,
      flex: 1,
      align: "center",
      headerAlign: "center",
      resizable: false,
      renderCell: (params) => (
        <Tooltip title="Supprimer">
          <IconButton
            sx={{ color: "#FF544F" }}
            onClick={() => handleDeleteFile(params.row.id)}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  const objectData = (data: FilesData) => {
    return data.filesCurrentUser.files.map((file) => ({
      id: file.id,
      addDate: formatTimestampDate(file.uploadAt),
      originalName: file.originalName,
      expirationDate: calculateExpirationDate(file.uploadAt),
      url: file.url,
      uniqueName: file.uniqueName,
      download: null,
      copy: null,
      delete: null,
    }));
  };

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
              <div style={{ height: 400, width: "100%" }}>
                <DataGrid
                  rows={data ? objectData(data) : []}
                  columns={columns}
                  pagination
                  paginationMode="server"
                  rowCount={totalRows}
                  paginationModel={{ page, pageSize }}
                  onPaginationModelChange={(params) => {
                    handlePageChange(params);
                  }}
                  sortingOrder={["desc", "asc"]}
                  onSortModelChange={(sort) => console.log(sort, "sort")}
                  disableRowSelectionOnClick
                  localeText={{
                    MuiTablePagination: {
                      labelDisplayedRows: ({ from, to, count }) =>
                        `${from}–${to} sur ${count}`,
                    },
                  }}
                  sx={{
                    borderStyle: "none",
                    "& .MuiDataGrid-cell:focus": {
                      outline: "none",
                    },
                    "& .MuiDataGrid-columnHeader:focus": {
                      outline: "none",
                    },
                    "& .MuiDataGrid-row:hover": {
                      backgroundColor: "inherit",
                    },
                    "& .MuiIconButton-root:focus": {
                      outline: "none",
                    },
                    "& .MuiDataGrid-cell:focus-within": {
                      outline: "none",
                    },
                    "& .MuiDataGrid-footerContainer": {
                      borderTop: "none",
                    },
                  }}
                  initialState={{
                    pagination: {
                      paginationModel: { page: 0, pageSize: 5 },
                    },
                  }}
                />
              </div>
            </Paper>
          )}
        </>
      )}
    </>
  );
};

export default FileList;
