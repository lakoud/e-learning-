import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Divider,
  IconButton,
  useTheme,
} from '@mui/material';
import person from '../../assets/user.png';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  useUpdateMutation,
} from '../../slices/InfoApiSlice';
import { tokens } from '../../theme';
import ArrowDropDownCircleOutlinedIcon from '@mui/icons-material/ArrowDropDownCircleOutlined';

const DetailsEleve = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const data = params.get('data');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [numtel, setNumtel] = useState('');
  const [inscription, setInscription] = useState([]);
  const navigate = useNavigate();
  const [update, { isLoading }] = useUpdateMutation();
  const [id, setId] = useState('');
  const [customFormation, setCustomFormation] = useState('customformaton-none');
  const [customIconFormation, setCustomIconFormation] = useState('');

  const handleCustomFormation = () => {
    if (customFormation === 'customformaton-show') {
      setCustomFormation('customformaton-none');
      setCustomIconFormation('');
    } else {
      setCustomFormation('customformaton-show');
      setCustomIconFormation('arowicon');
    }
  };

  useEffect(() => {
    try {
      if (data) {
        const decodedData = JSON.parse(decodeURIComponent(data));
        setInscription(decodedData.inscription);
        setId(decodedData._id);
        setNom(decodedData.nom);
        setPrenom(decodedData.prenom);
        setEmail(decodedData.email);
        setAge(decodedData.age);
        setNumtel(decodedData.numtel);
      }
    } catch (error) {
      console.error(error);
    }
  }, [data]);

  return (
    <Box m="50px 50px 0 50px" height="100vh">
      <Box
        display="flex"
        gap={'15px'}
        alignItems="center"
        sx={{ borderRadius: '10px', border: '1px solid black' }}
        padding={'15px'}
      >
        <Box>
          <img
            alt="profile-user"
            width="200px"
            height="200px"
            src={person}
            style={{ borderRadius: '50%' }}
          />
        </Box>

        <Box>
          <Typography
            variant="h2"
            color={colors.grey[100]}
            fontWeight="bold"
            sx={{ mb: '5px' }}
          >
            {nom + ' ' + prenom}
          </Typography>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="space-between"
          >
            <Typography
              variant="h5"
              color={colors.grey[300]}
              sx={{ m: '15px 0 5px 20px' }}
            >
              Email :
              <Typography
                variant="h5"
                color={colors.grey[100]}
                sx={{ m: '15px 0 5px 20px' }}
              >
                {email}
              </Typography>
            </Typography>
          </Box>

          <Typography
            variant="h5"
            color={colors.grey[300]}
            sx={{ m: '15px 0 5px 20px' }}
          >
            Numéro de téléphone :
            <Typography
              variant="h5"
              color={colors.grey[100]}
              sx={{ m: '15px 0 5px 20px' }}
            >
              {numtel}
            </Typography>
          </Typography>
          <Typography
            variant="h5"
            color={colors.grey[300]}
            sx={{ m: '15px 0 5px 20px' }}
          >
            Age :
            <Typography
              variant="h5"
              color={colors.grey[100]}
              sx={{ m: '15px 0 5px 20px' }}
            >
              {age}
            </Typography>
          </Typography>
        </Box>

        <Box></Box>
      </Box>
      <Box
        onClick={handleCustomFormation}
        className="formatioons-box"
        display="flex"
        justifyContent="space-between"
        backgroundColor={colors.greenAccent[400]}
      >
        <Typography
          variant="h3"
          sx={{ m: '5px 0 5px 20px' }}
        >
          Formations Inscrites
        </Typography>
        <Box sx={{ m: '5px 30px 5px 60px' }}>
          <ArrowDropDownCircleOutlinedIcon className={customIconFormation} />
        </Box>
      </Box>
      <Box className={customFormation}>
        {inscription?.map((item) => (
          <>
            <Typography
              variant="h3"
              color={colors.grey[300]}
              sx={{ m: '15px 0 5px 20px' }}
            >
              <Divider sx={{ height: 3, m: '20px' }} color={colors.grey[300]} />

              <Box display="flex">
                <Typography
                  variant="h3"
                  color={colors.greenAccent[400]}
                  sx={{ m: '15px 0 5px 20px' }}
                >
                  {item.nom}
                </Typography>
              </Box>
            </Typography>
            <Typography
              key={item._id}
              variant="h5"
              color={colors.grey[300]}
              sx={{ m: '15px 0 5px 55px' }}
            >
              <Typography
                variant="h5"
                color={colors.grey[300]}
                sx={{ m: '15px 0 5px 20px' }}
              >
                {item.description}
              </Typography>
            </Typography>

            <Box
              onClick={() => handlCustom(item._id)}
              color="white"
              className="box-cours"
            ></Box>
          </>
        ))}
      </Box>
    </Box>
  );
};

export default DetailsEleve;
