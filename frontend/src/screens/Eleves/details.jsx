import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Divider,
  useTheme,
} from '@mui/material';
import person from '../../assets/user.png';
import { useLocation, useNavigate } from 'react-router-dom';

import { tokens } from '../../theme';
import ArrowDropDownCircleOutlinedIcon from '@mui/icons-material/ArrowDropDownCircleOutlined';
import useMediaQuery from "@mui/material/useMediaQuery";

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

  const [nvEtud, setnvEtud] = useState('');
  const [genre, setGenre] = useState('');
  
  const [createdAt, setcreatedAt] = useState('');

  const [numtel, setNumtel] = useState('');
  const [inscription, setInscription] = useState([]);
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [customFormation, setCustomFormation] = useState('customformaton-none');
  const [customIconFormation, setCustomIconFormation] = useState('');
  const isNonMobile = useMediaQuery("(min-width:600px)");

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
        setAge(decodedData.datedenaissance);
        setNumtel(decodedData.numtel);
        setnvEtud(decodedData.nvEtude);
        setGenre(decodedData.genre);
        setcreatedAt(decodedData.createdAt)
      }
    } catch (error) {
      console.error(error);
    }
  }, [data]);

  return (
    <Box m="2% 5% 0 10%" height="100vh"
 
  > 
      <Box
        display= {isNonMobile?"flex":""}
        gap={'15px'}
        padding={'15px'}

        sx={{
          padding: '15px ',
          margin:"auto",  
      }}
      >
        <Box  sx={{
          padding: '15px ',
          margin:"auto",
      }}>
        <Box>
          <img
            alt="profile-user"
            width="200px"
            height="200px"
            src={person}
            style={{ borderRadius: '50%',marginRight:"25px" }}
          />
        </Box>

        <Box>
          <Typography
            variant="h2"
            color={colors.grey[100]}
            fontWeight="bold"
            sx={{ mt: '10px' }}
          >
            {nom }
          </Typography>
       
        </Box>


        </Box>

        <Box        
          sx={{borderLeft: '1px solid rgba(0, 0, 0, 0.1)',
          boxShadow: '2px 2px 2px  rgba(0, 0, 0, 0.1)', 
          padding: '15px ',
          width:"100%",
          marginTop:"15px",
      }}
>
        <Box
          display= {isNonMobile?"flex":""}
    
          >
            <Typography
              variant="h5"
              color={colors.grey[300]}
              fontWeight="bold"
              sx={{ m: '15px 0 5px 20px' }}
            >
              Email :
         
            </Typography>
            <Typography
              
              variant="h5"
              color={colors.grey[100]}
              sx={{ m: '15px 0 5px 20px' }}
            >
              {email}
            </Typography>
          </Box>
          <Box
              display= {isNonMobile?"flex":""}
     
          >
            <Typography
              variant="h5"
              color={colors.grey[300]}
              fontWeight="bold"
              sx={{ m: '15px 0 5px 20px' }}
            >
              ID :
         
            </Typography>
            <Typography
              
              variant="h5"
              color={colors.grey[100]}
              sx={{ m: '15px 0 5px 20px',
              maxWidth: '100%', // Ajoutez la valeur souhaitée pour la largeur maximale
              overflowWrap: 'break-word'
            }}
            >
              {id}
            </Typography>
          </Box>
          <Divider  color={colors.grey[900]} />

        <Box
                 display= {isNonMobile?"flex":""}
  
        >
          <Typography
            fontWeight="bold"
            variant="h5"
            color={colors.grey[300]}
            sx={{ m: '15px 0 5px 20px',
            maxWidth: '100%', 
            width:'100%',
            overflowWrap: 'break-word'
          }}
          >
            Numéro de téléphone :
            <Typography
              variant="h5"
              color={colors.grey[100]}
              sx={{ mt: '15px '  , width:'100%',
            }}
            >
              {numtel}
            </Typography>
          </Typography>
          <Typography
            fontWeight="bold"
            variant="h5"
            color={colors.grey[300]}
            sx={{ m: '15px 0 5px 20px' , width:"100%"}}
          >
            Age :
            <Typography
              fontWeight="bold"
              variant="h5"
              color={colors.grey[100]}
              sx={{ mt: '15px ', width:"100%" }}
            >
              {age}
            </Typography>
          </Typography>
          <Typography
            variant="h5"
            fontWeight="bold"
            color={colors.grey[300]}
            sx={{ m: '15px 0 5px 20px' , width:"100%"}}
          >
            Genre :
            <Typography
              variant="h5"
              color={colors.grey[100]}
                sx={{ mt: '15px ' , width:"100%" }}
            >
              {genre}
            </Typography>
          </Typography>
          <Typography
            fontWeight="bold"
            variant="h5"
            color={colors.grey[300]}
            sx={{ m: '15px 0 5px 20px', width:"100%" }}
          >
            Niveau d'étude :
            <Typography
              variant="h5"
              color={colors.grey[100]}
              sx={{ mt: '15px' , width:"100%"}}
            >
              {nvEtud}
            </Typography>
          </Typography>
          </Box>
          <Box
                 display= {isNonMobile?"flex":""}
  
        >
          <Typography
            fontWeight="bold"
            variant="h5"
            
            color={colors.grey[300]}
            sx={{ m: '15px 0 5px 20px', maxWidth: '100%',}}
          >
            Date de création:
            <Typography
              variant="h5"
              color={colors.grey[100]}
              sx={{ mt: '15px ',
              maxWidth: '100%', // Ajoutez la valeur souhaitée pour la largeur maximale
              overflowWrap: 'break-word'
            }}
            >
              {createdAt}
            </Typography>
          </Typography>
          <Typography
            fontWeight="bold"
            variant="h5"
            color={colors.grey[300]}
            sx={{ m: '15px 0 5px 20px', width:"100%" }}
          >
            Nombre de formations inscrites:
            <Typography
              variant="h5"
              color={colors.grey[100]}
              sx={{ mt: '15px ',
              maxWidth: '100%', // Ajoutez la valeur souhaitée pour la largeur maximale
              overflowWrap: 'break-word'
            }}
            >
              {inscription.length}
            </Typography>
          </Typography>
          </Box>
      </Box>


      </Box>
      
      <Box
        onClick={handleCustomFormation}
        className="formatioons-box"
        display= {isNonMobile?"flex":""}
        justifyContent="space-between"
        backgroundColor={colors.blueAccent[400]}
        sx={{ mb: '15px ' }}

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

              <Box         display= {isNonMobile?"flex":""}
>
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
                sx={{ mt: '5px' }}
              >
                {item.description}
              </Typography>
            </Typography>

            <Box
              onClick={() => handlCustom(item._id)}
              color="white"
              className="box-cours"
            ></Box>
             <Divider sx={{ height: 3, m: '20px' }} color={colors.grey[300]} />

          </>
        ))}
      </Box>
    </Box>
  );
};

export default DetailsEleve;
