import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { tokens } from '../../theme';
import Header from '../../components/Header';
import { useTheme } from '@mui/material';
import { useGetMutation, useDeleteMutation } from '../../slices/EnsgApiSlice';
import Loader from '../../components/Loader';
import { Link, useNavigate } from 'react-router-dom';
import DeleteSweepOutlinedIcon from '@mui/icons-material/DeleteSweepOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const Enseignants = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [getInfo, { isLoading }] = useGetMutation();
  const [data, setData] = useState([]);
  const [supprim] = useDeleteMutation();
  const [deleteRowId, setDeleteRowId] = useState(null);
  const navigate = useNavigate();

  const details = async (objet) => {
    const encodedData = encodeURIComponent(JSON.stringify(objet));
    navigate(`/DetailsEnsg?data=${encodedData}`);
  };

  const supprimer = async () => {
    try {
      await supprim(deleteRowId).unwrap();
      setData((prevRows) => prevRows.filter((row) => row.id !== deleteRowId));
      setDeleteRowId(null);
    } catch (err) {
      console.log(err);
    }
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
          nom: item.nom + ' ' + item.prenom,
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
      field: 'nom',
      headerName: 'Nom et prénom',
      flex: 1,
      cellClassName: 'name-column--cell',
    },
    {
      field: 'numtel',
      headerName: 'Phone Number',
      flex: 1,
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => {
        const rowId = params.row.id;
        return (
          <div>
            <span onClick={() => setDeleteRowId(rowId)}>
              <DeleteSweepOutlinedIcon className="action-icon" />
            </span>
            <span onClick={() => details(params.row)}>
              <InfoOutlinedIcon className="action-icon" />
            </span>
          </div>
        );
      },
    },
  ];

  return (
    <div className="main-banner">
      <Box>
        <Header title="Enseignants" subtitle="List of Enseignants " />
        {isLoading && <Loader />}
        <div className="d-flex justify-content-end">
          <Link to="/addensg">
            <Button variant="contained" color="info">
              Ajouter
            </Button>
          </Link>
        </div>
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
        </Box>

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
    </div>
  );
};

export default Enseignants;
