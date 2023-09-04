import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useGetMutation, useDeleteMutation } from "../../slices/InfoApiSlice";
import DeleteSweepOutlinedIcon from "@mui/icons-material/DeleteSweepOutlined";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import { useTheme } from "@emotion/react";

const InfoGenrale = () => {
  const navigate = useNavigate();
  const [deleteRowId, setDeleteRowId] = useState(null);
  const [data, setData] = useState([]);
  const [getInfo, { isLoading }] = useGetMutation();
  const [supprim, { isLoadingg }] = useDeleteMutation();
  const theme = useTheme();

  useEffect(() => {
    const getHandler = async () => {
      try {
        const userData = await getInfo();
        const modifiedData = userData.data.map((item) => ({
          ...item,
          id: item._id,
        }));
        setData(modifiedData);
      } catch (err) {
        console.log(err);
      }
    };

    getHandler();
  }, []);

  const supprimer = async () => {
    try {
      await supprim(deleteRowId).unwrap();
      setData((prevRows) => prevRows.filter((row) => row.id !== deleteRowId));
      setDeleteRowId(null);
      toast.success("Successfully deleted!");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const edit = async (objet) => {
    const encodedData = encodeURIComponent(JSON.stringify(objet));
    navigate(`/edit?data=${encodedData}`);
  };

  const columns = [
    {
      flex: 1,
      field: "titre",
      headerName: "Titre",
      cellClassName: "name-column--cell",
    },
    {
      field: "description",
      flex: 1,
      headerName: "Description",
    },
    {
      field: "numtel",
      headerName: "Numéro tel",
      flex: 1,
    },
    {
      field: "actions",
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
        <Header title="Informations générales du site" />
        {isLoading && <Loader />}
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
              color: tokens(theme.palette.mode).greenAccent[300],
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: tokens(theme.palette.mode).blueAccent[500],
              borderBottom: "none",
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: tokens(theme.palette.mode).primary[400],
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "none",
              backgroundColor: tokens(theme.palette.mode).blueAccent[500],
            },
            "& .MuiCheckbox-root": {
              color: tokens(theme.palette.mode).greenAccent[200] + " !important",
            },
            "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
              color: tokens(theme.palette.mode).grey[100] + " !important",
            },
          }}
        >
          {data.length === 0 ? (
            <div className="d-flex justify-content-end">
              <Link to="/add">
                <Button variant="contained" color="info">
                  Ajouter
                </Button>
              </Link>
            </div>
          ) : (
            ""
          )}
          <DataGrid
            rows={data}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
          />
          <Dialog open={!!deleteRowId} onClose={() => setDeleteRowId(null)}>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogContent>
              Êtes-vous certain(e) de vouloir supprimer cette ligne ?
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setDeleteRowId(null)}
                color="primary"
              >
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

export default InfoGenrale;
