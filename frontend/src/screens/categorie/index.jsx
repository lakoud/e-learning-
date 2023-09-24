import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import DeleteSweepOutlinedIcon from "@mui/icons-material/DeleteSweepOutlined";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import {
  useGetMutation,
  useDeleteMutation,
} from "../../slices/categorieApiSlice";

const ListCategories = () => {
  const navigate = useNavigate();

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [getInfo, { isLoading }] = useGetMutation();
  const [data, setData] = useState([]);
  const [supprim, { isLoading: isLoadingDelete }] = useDeleteMutation();
  const [deleteRowId, setDeleteRowId] = useState(null);

  const supprimer = async () => {
    try {
      await supprim(deleteRowId).unwrap();
      setData((prevRows) => prevRows.filter((row) => row.id !== deleteRowId));
      setDeleteRowId(null);

      toast.success("Catégorie a été supprimé avec succès.");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const edit = async (objet) => {
    const encodedData = encodeURIComponent(JSON.stringify(objet));
    navigate(`/EditCategorie?data=${encodedData}`);
  };

  const handleCloseDialog = () => {
    setDeleteRowId(null);
  };

  useEffect(() => {
    const getHandler = async () => {
      try {
        const userData = await getInfo();
        const modifiedData = userData.data.map((item) => ({
          ...item,
          id: item._id,
          nbFormation:1
        }));
        setData(modifiedData);
      } catch (err) {
        console.log(err);
      }
    };

    getHandler();
  }, []);

  const columns = [
    {
      field: "nomCategorie",
      headerName: "Nom",
      cellClassName: "name-column--cell",    flex: 1,
    },
    {
      field: "nbFormation",
      headerName: "Nombre des formations",    flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "actions",    flex: 1,
      headerName: "Actions",
      width: 200,
      renderCell: (params) => {
        const rowId = params.row.id;
        return (
          <div>
            <span onClick={() => setDeleteRowId(rowId)}>
              <DeleteSweepOutlinedIcon className="action-icon" />
            </span>
            <span onClick={() => edit(params.row)}>
              <EditNoteOutlinedIcon className="action-icon" />
            </span>
          </div>
        );
      },
    },
  ];

  return (
    <div className="main-banner">
      <Box m="20px">
        <Header title="Les Catégories" subtitle="Liste des categories" />
        {isLoading && <Loader />}
        <div className="d-flex justify-content-end">
          <Link to="/addCategorie">
            <Button variant="contained" color="info">
              Ajouter
            </Button>
          </Link>
        </div>
        <Box
          m="40px 0 0 0"
          height="75vh"
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
            },
            "& .name-column--cell": {
              color: colors.greenAccent[300],
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: `${colors.blueAccent[500]} `,
              borderBottom: "none",
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: colors.primary[400],
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "none",
              backgroundColor: `${colors.blueAccent[500]} `,
            },
            "& .MuiCheckbox-root": {
              color: `${colors.greenAccent[200]} !important`,
            },
            "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
              color: `${colors.grey[100]} !important`,
            },
          }}
        >
      
          <DataGrid
            rows={data}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
          />
          <Dialog open={!!deleteRowId} onClose={handleCloseDialog}>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogContent>
              Êtes-vous certain(e) de vouloir supprimer cette ligne ?
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                Annuler
              </Button>
              <Button onClick={supprimer} color="secondary">
                Supprimer
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </div>
  );
};

export default ListCategories;
