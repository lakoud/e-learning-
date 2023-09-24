import React, { useState, useEffect } from 'react';
import {
  Box,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { tokens } from '../../theme';
import Header from '../../components/Header';
import Loader from '../../components/Loader';
import DeleteSweepOutlinedIcon from '@mui/icons-material/DeleteSweepOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useGetMutation, useDeleteMutation } from '../../slices/ParentsApiSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";

const Parents = () => {
  const [data, setData] = useState([]);
  const [getData, { isLoading }] = useGetMutation();
  const [supprim] = useDeleteMutation();
  const [deleteRowId, setDeleteRowId] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    const getHandler = async () => {
      try {
        const userData = await getData();
        const modifiedData = userData.data.map((item) => ({
          ...item,
          id: item._id,
          nom: item.nom + ' ' + item.prenom,
        }));
        setData(modifiedData);

      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    };

    getHandler();
  }, []);

  const details = (objet) => {
    const encodedData = encodeURIComponent(JSON.stringify(objet));
    navigate(`/DetailsParent?data=${encodedData}`);
  };

  const handleCloseDialog = () => {
    setDeleteRowId(null);
  };

  const supprimer = async () => {
    try {
      await supprim(deleteRowId).unwrap();
      setData((prevRows) => prevRows.filter((row) => row.id !== deleteRowId));
      setDeleteRowId(null);
      toast.success("Parent a été supprimé avec succès.");

    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const columns = [
    {
      flex: 1,
      field: 'nom',
      headerName: 'Nom et Prénom',
      cellClassName: 'name-column--cell',
    },
    { flex: 1, field: 'email', headerName: 'Email' },
    { flex: 1, field: 'numtel', headerName: 'Numéro de téléphone' },
    {
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }) => (
        <div>
          <span onClick={() => setDeleteRowId(row.id)}>
            <DeleteSweepOutlinedIcon className="action-icon" />
          </span>
          <span onClick={() => details(row)}>
            <InfoOutlinedIcon className="action-icon" />
          </span>
        </div>
      ),
    },
  ];

  return (
    <div className="main-banner">
      <Box>
        <Header
          title="Les parents"
          subtitle="Liste des parents "
        />
        {isLoading && <Loader />}
        <Box
          m="40px 0 0 0"
          height="75vh"
          sx={{
            '& .MuiDataGrid-root': {
              border: 'none',
            },
            '& .MuiDataGrid-cell': {
              borderBottom: 'none',
            },
            '& .name-column--cell': {
              color: colors.greenAccent[300],
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: `${colors.blueAccent[500]} `,
              borderBottom: 'none',
            },
            '& .MuiDataGrid-virtualScroller': {
              backgroundColor: colors.primary[400],
            },
            '& .MuiDataGrid-footerContainer': {
              borderTop: 'none',
              backgroundColor: `${colors.blueAccent[500]} `,
            },
            '& .MuiCheckbox-root': {
              color: `${colors.greenAccent[200]} !important`,
            },
            '& .MuiDataGrid-toolbarContainer .MuiButton-text': {
              color: `${colors.grey[100]} !important`,
            },
          }}
        >
          <DataGrid
            rows={data}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
          />
          <Dialog open={deleteRowId !== null} onClose={handleCloseDialog}>
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

export default Parents;
