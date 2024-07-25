import * as React from "react";
import { useEffect, useState } from "react";
import {
  Paper,
  Tooltip,
  IconButton,
  Typography,
  CircularProgress,
  Stack,
  Box,
} from "@mui/material";
import { DataGrid, GridColDef, GridSortModel } from "@mui/x-data-grid";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
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
import { showLogo } from "@/helpers/fileLogo";

interface File {
  id: string;
  mimeType: string;
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
  const client = useApolloClient();
  const [page, setPage] = useState<number>(0);
  const [sort, setSort] = useState<string>("desc");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { data: meData } = useQuery(queryMe);
  const userId = meData?.me?.id;

  const { loading, error, data, refetch } = useQuery(getUserFiles, {
    variables: {
      limit: 5,
      offset: page * 5,
      sortOrder: sort,
    },
    skip: !userId,
  });
  console.log(data);

  const total = data?.filesCurrentUser?.total;

  const [doDeleteFile, { error: deleteFileError }] = useMutation(
    mutationDeleteFile,
    {
      refetchQueries: [getUserFiles],
    },
  );

  useEffect(() => {
    client.refetchQueries({
      include: [getUserFiles],
    });
  }, [client]);

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

  const handleSortModelChange = (sortModel: GridSortModel) => {
    if (sortModel.length > 0) {
      const newSort = sortModel[0].sort === "asc" ? "desc" : "asc";
      setSort(newSort);
      refetch({
        limit: 5,
        offset: page * 5,
        sortOrder: newSort,
      });
    } else {
      setSort("desc");
      refetch({
        limit: 5,
        offset: page * 5,
        sortOrder: "desc",
      });
    }
  };

  const handlePageChange = (params: any) => {
    setPage(params.page);
    refetch({
      limit: 5,
      offset: params.page * 5,
      sortOrder: "desc",
    });
  };

  const isOpenable = (mimetype: string) => {
    if (
      mimetype.includes("pdf") ||
      mimetype.includes("image") ||
      mimetype.includes("video") ||
      mimetype.includes("audio")
    ) {
      return true;
    } else {
      return false;
    }
  };

  const openFile = async (uniqueName: String) => {
    try {
      const response = await axios.get(`${API_URL}/download`, {
        params: {
          name: uniqueName,
        },
        responseType: "blob",
      });

      const file = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const fileUrl = URL.createObjectURL(file);

      window.open(fileUrl, "_blank");
    } catch (error) {
      console.error("Error opening file:", error);
      toast.error("Problème lors de l'ouverture du fichier...");
    }
  };

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [loading]);

  const columns: GridColDef[] = [
    {
      field: "logo",
      headerName: "",
      disableColumnMenu: true,
      flex: 1,
      align: "center",
      headerAlign: "center",
      resizable: false,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{
          height: '100%',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          {showLogo(params.row.mimeType, 24)}
        </Box>
      ),
    },
    {
      field: "originalName",
      headerName: "Nom du fichier",
      sortable: false,
      disableColumnMenu: true,
      flex: 3,
      align: "center",
      headerAlign: "center",
      resizable: false,
      renderCell: (params) => <div data-testid="file-name">{params.value}</div>,
    },
    {
      field: "addDate",
      headerName: "Date d'ajout",
      disableColumnMenu: true,
      flex: 1.5,
      align: "center",
      headerAlign: "center",
      resizable: false,
    },
    {
      field: "expirationDate",
      headerName: "Date d'expiration",
      sortable: false,
      disableColumnMenu: true,
      flex: 1.5,
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
            data-testid="download"
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
            data-testid="copy"
          >
            <InsertLinkIcon />
          </IconButton>
        </Tooltip>
      ),
    },
    {
      field: "open",
      headerName: "Ouvrir",
      sortable: false,
      disableColumnMenu: true,
      flex: 1,
      align: "center",
      headerAlign: "center",
      resizable: false,
      renderCell: (params) => {
        return isOpenable(params.row.mimeType) ? (
          <Tooltip title="Ouvrir">
            <IconButton
              sx={{ color: "#FF544F" }}
              onClick={() => openFile(params.row.uniqueName)}
              data-testid="open"
            >
              <OpenInNewIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <></>
        );
      },
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
            data-testid="delete"
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
      logo: null,
      addDate: formatTimestampDate(file.uploadAt),
      mimeType: file.mimeType,
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
      {isLoading ? (
        <CircularProgress />
      ) : error ? (
        <Typography>{error.message}</Typography>
      ) : (
        <>
          {total === 0 ? (
            <Typography>
              Vous n&apos;avez pas encore téléversé de fichiers
            </Typography>
          ) : (
            <Paper
              sx={{
                height: 280,
                width: "95%",
                boxShadow: "none",
                marginBottom: "15px",
              }}
            >
              <Stack height="400" width="100%">
                <DataGrid
                  rows={data ? objectData(data) : []}
                  columns={columns}
                  pagination
                  paginationMode="server"
                  rowCount={total}
                  paginationModel={{ page: page, pageSize: 5 }}
                  pageSizeOptions={[5]}
                  onPaginationModelChange={(params) => {
                    handlePageChange(params);
                  }}
                  sortingOrder={["desc", "asc"]}
                  onSortModelChange={handleSortModelChange}
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
              </Stack>
            </Paper>
          )}
        </>
      )}
    </>
  );
};

export default FileList;
