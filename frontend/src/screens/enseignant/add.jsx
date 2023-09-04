import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Alert,
} from '@mui/material';
import * as yup from 'yup';
import Header from '../../components/Header';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAddMutation } from '../../slices/EnsgApiSlice';

const phoneRegExp =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const validationSchema = yup.object().shape({
  nom: yup.string().required('Nom requis'),
  prenom: yup.string().required('Prénom requis'),
  email: yup.string().email('Email invalide').required('Email requis'),
  numtel: yup
    .string()
    .matches(phoneRegExp, 'Numéro de téléphone invalide')
    .required('Numéro de téléphone requis'),
  password: yup.string().required('Mot de passe requis'),
});

const AddEnsg = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const data = params.get('data');

  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [numtel, setNumtel] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState(null);

  const navigate = useNavigate();

  const [add, { isLoading }] = useAddMutation();

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      await add({ nom, prenom, email, numtel, password }).unwrap();
      navigate('/Enseignants');
    } catch (error) {
      console.log(error);
      setErr('L\'email existe déjà !');
    }
  };

  return (
    <Box m="20px">
      <Header title="Ajouter Enseignant" subtitle="Ajouter des informations enseignant" />
      {err != null && (
        <Box sx={{ mb: '14px' }}>
          <Alert severity="error">{err}</Alert>
        </Box>
      )}

      <form onSubmit={onSubmit}>
        <Box
          display="grid"
          gap="30px"
          gridTemplateColumns="repeat(4, minmax(0, 1fr))"
          sx={{
            "& > div": { gridColumn: 'span 4' },
          }}
        >
          <TextField
            fullWidth
            variant="filled"
            type="text"
            label="Nom"
            required
            value={nom}
            name="nom"
            onChange={(e) => setNom(e.target.value)}
            sx={{ gridColumn: 'span 4' }}
          />
          <TextField
            fullWidth
            variant="filled"
            multiline
            type="text"
            label="Prénom"
            required
            onChange={(e) => setPrenom(e.target.value)}
            value={prenom}
            name="prenom"
            rows={5}
            sx={{ gridColumn: 'span 4' }}
          />
          <TextField
            fullWidth
            variant="filled"
            type="text"
            label="Email"
            required
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            name="email"
            sx={{ gridColumn: 'span 2' }}
          />
          <TextField
            fullWidth
            variant="filled"
            type="text"
            label="Numéro de téléphone"
            required
            onChange={(e) => setNumtel(e.target.value)}
            value={numtel}
            name="numtel"
            sx={{ gridColumn: 'span 2' }}
          />
          <TextField
            fullWidth
            variant="filled"
            type="password"
            label="Mot de passe"
            required
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            name="password"
            sx={{ gridColumn: 'span 4' }}
          />
        </Box>
        <Box display="flex" justifyContent="end" mt="20px">
          <Button type="submit" color="secondary" variant="contained">
            Ajouter
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default AddEnsg;
