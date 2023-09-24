import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  useTheme,
  Typography,
  Divider,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useLocation } from 'react-router-dom';
import { useEditMutation } from '../../slices/EnsgApiSlice';
import { useNavigate } from 'react-router-dom';
import { tokens } from "../../theme";
import Calendrier from "./caleder";
import person from '../../assets/user.png';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import ArrowDropDownCircleOutlinedIcon from '@mui/icons-material/ArrowDropDownCircleOutlined';

const DetailsEnsg = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const data = params.get('data');

  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [numtel, setNumtel] = useState('');
  const [listFormation, setListFormation] = useState([]);
  const [id, setId] = useState('');
  const [edit, setEdit] = useState(true);
  const [custom, setCustom] = useState('custom-none');
  const [customIcon, setCustomIcon] = useState();
  const [idForm, setIdForm] = useState('');
  const [customFormation, setCustomFormation] = useState('customformaton-none');
  const [customIconFormation, setCustomIconFormation] = useState('');
  
  const [genre, setgenre] = useState('');
  const [datecreated, setdatecreated] = useState('');

  const navigate = useNavigate();
  const [update, { isLoading }] = useEditMutation();

  useEffect(() => {
    try {
      if (data) {
        const decodedData = JSON.parse(decodeURIComponent(data));
        setId(decodedData._id);
        setNom(decodedData.nom);
        setPrenom(decodedData.prenom);
        setEmail(decodedData.email);
        setPassword(decodedData.password);
        setNumtel(decodedData.numtel);
        setListFormation(decodedData.formation);
        setgenre(decodedData.genre);
        setdatecreated(decodedData.createdAt)
        console.log(decodedData)
      }
    } catch (error) {
      console.log(error);
    }
  }, [data]);

  const handleCustom = (id) => {
    setIdForm(id);
    if (custom === "custom-show") {
      setCustom('custom-none');
      setCustomIcon('');
    } else {
      setCustom("custom-show");
      setCustomIcon("arowicon");
    }
  };

  const handleCustomFormation = () => {
    if (customFormation === "customformaton-show") {
      setCustomFormation('customformaton-none');
      setCustomIconFormation('');
    } else {
      setCustomFormation("customformaton-show");
      setCustomIconFormation('arowicon');
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      await update({ id, nom, prenom, email, numtel, password });
      setEdit(true);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box m="5% 5% 0 10%" height="100vh">
      <Box     display= {isNonMobile?"flex":""}
        gap={'15px'}
        padding={'15px'}

        sx={{
          padding: '15px ',
          margin:"auto",
      }} >     
     <Box>
     <Box  display="flex" justifyContent="center" alignItems="center">
        <img
          alt="profile-user"
          width="200px"
          height="200px"
          src={person}
          style={{ borderRadius: '50%',marginRight:"25px" }}
        />
      </Box>

      <Box display="flex" justifyContent="center" alignItems="center">
        <Typography
          variant="h2"
          color={colors.grey[100]}
          fontWeight="bold"
          sx={{ mb: "5px" ,mt:"15px"}}
        >
          {nom }
        </Typography>
      </Box>

      <Box display="flex" justifyContent="center" alignItems="center">
        <Typography variant="h5" color={colors.greenAccent[400]}>
           Enseignant
        </Typography>
      </Box>
     </Box>
          <Box
            sx={{
               borderRadius: '10px',
                border: '1px solid black',
                width:'100%'
               }}
           
          >
            {edit ? (
              <Box  sx={{
                 width:'100%',
                 height:'100%',
                 marginBlock:"50px",
                 display: 'block',
                 flexDirection: 'column',
                 justifyContent: 'center',
                 
                 
                }} >

                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="space-between"
                >
                  <Box
                   display={isNonMobile? "flex":""}
                  >
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    color={colors.grey[300]}
                    sx={{ m: "15px 0 5px 20px" }}
                  >
                    Email :
                  
                  </Typography>
                    <Typography
                      variant="h5"
                      
                      color={colors.grey[100]}
                      sx={{ m: "15px 0 5px 20px" }}
                    >
                      {email}
                    </Typography>
                    </Box>
                  <Box padding={"10px"}className="action-icon" onClick={() => setEdit(!edit)}>
                    <EditTwoToneIcon />
                  </Box>
                </Box>


                <Box
                     display={isNonMobile? "flex":""}
                  
                >
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  color={colors.grey[300]}
                  sx={{ m: "15px 0 5px 20px" }}
                >
                  ID :
               
                </Typography> 
                  <Typography
                    variant="h5"
                    color={colors.grey[100]}
                    sx={{ m: "15px 0 5px 20px" }}
                  >
                    {id}
                  </Typography>
                </Box>
              
              
              
              
                <Box 
                      display={isNonMobile? "flex":""}
                margin="auto"
                
                > 
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  color={colors.grey[300]}
                  sx={{ m: "15px 0 5px 20px", maxWidth: '100%', 
                  overflowWrap: 'break-word' }}
                >
                  Numéro de téléphone :
                  <Typography
                    variant="h5"
                    color={colors.grey[100]}
                    sx={{ mt: '15px ',
                    maxWidth: '100%', 
                    overflowWrap: 'break-word'
                  }}
                  >
                    {numtel}
                  </Typography>
                </Typography>
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  color={colors.grey[300]}
                  sx={{ m: "15px 0 5px 20px",
                   maxWidth: '100%', 
                  overflowWrap: 'break-word' }}
                >
                 Genre :
                  <Typography
                    variant="h5"
                    color={colors.grey[100]}
                     sx={{mt: '15px ',
                      maxWidth: '100%', 
                  overflowWrap: 'break-word' }}
                  >
                    {genre}
                  </Typography>
                </Typography>
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  color={colors.grey[300]}
                  sx={{ m: "15px 0 5px 20px", 
                  maxWidth: '100%', 
                  overflowWrap: 'break-word' }}
                >
                 Nombre des formations :
                  <Typography
                    variant="h5"
                    color={colors.grey[100]}
                    sx={{ mt: '15px ',
                     maxWidth: '100%', 
                    overflowWrap: 'break-word' }}
                  >
                    {listFormation.length}
                  </Typography>
                </Typography>
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  color={colors.grey[300]}
                  sx={{ m: "15px 0 5px 20px", 
                  maxWidth: '100%', 
                  overflowWrap: 'break-word' }}
                >
                    Date de création :
                  <Typography
                    variant="h5"
                    color={colors.grey[100]}
                    sx={{ mt: '15px ',
                     maxWidth: '100%', 
                    overflowWrap: 'break-word' }}
                  >
                    {datecreated}
                  </Typography>
                </Typography>
             
                </Box>
              </Box>
            ) : (
              <form onSubmit={onSubmit}>
                <Box
                  padding="15px"
                  display="grid"
                  gap="30px"
                  gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                  sx={{
                    "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                  }}
                >
                  <TextField
                    fullWidth
                    type="text"
                    label="Nom"
                    required
                    value={nom}
                    name="nom"
                    onChange={(e) => setNom(e.target.value)}
                    sx={{ gridColumn: "span 4" }}
                  />
                  <TextField
                    required
                    fullWidth
                    type="text"
                    label="Prenom"
                    onChange={(e) => setPrenom(e.target.value)}
                    value={prenom}
                    name="prenom"
                    rows={5}
                    sx={{ gridColumn: 'span 4' }}
                  />
                  <TextField
                    required
                    fullWidth
                    type="text"
                    label="Email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    name="email"
                    sx={{ gridColumn: "span 2" }}
                  />
                  <TextField
                    required
                    fullWidth
                    type="text"
                    label="Numéro téléphone"
                    onChange={(e) => setNumtel(e.target.value)}
                    value={numtel}
                    name="numtel"
                    sx={{ gridColumn: "span 2" }}
                  />
                  <TextField
                    required
                    fullWidth
                    type="password"
                    label="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    name="password"
                    sx={{ gridColumn: "span 4" }}
                  />
                </Box>
                <Box display="flex" justifyContent="end" padding="15px">
                  <Button type="submit" color="info" variant="contained">
                    Modifier
                  </Button>
                </Box>
              </form>
            )}
          </Box>
      </Box>

      <Box>
     

        <Box onClick={handleCustomFormation} 
        className="formatioons-box" 
        display="flex" 
        justifyContent="space-between"
        backgroundColor={colors.blueAccent[400]}>
          <Typography
            variant="h3"
            sx={{ m: "5px 0 5px 20px" }}
          >
            Formations
          </Typography>
          <Box sx={{ m: "5px 30px 5px 60px" }}>
            <ArrowDropDownCircleOutlinedIcon className={customIconFormation} />
          </Box>
        </Box>

        <Box className={customFormation}>
          {listFormation?.map((item) => (
            <React.Fragment key={item._id}>
              <Typography
                variant="h3"
                color={colors.grey[300]}
                sx={{ m: "15px 0 5px 20px" }}
              >
                <Divider sx={{ height: 3, m: "20px" }} color={colors.grey[300]} />
                <Box display="flex">
                  <Typography
                    variant="h3"
                    color={colors.greenAccent[400]}
                    sx={{ m: "15px 0 5px 20px" }}
                  >
                    {item.nom}
                  </Typography>
                  <Box padding={"10px"} className="action-icon">
                    <EditTwoToneIcon />
                  </Box>
                </Box>
              </Typography>
              <Typography
                variant="h5"
                color={colors.grey[300]}
                sx={{ m: "15px 0 5px 55px" }}
              >
                <Typography
                  variant="h5"
                  color={colors.grey[300]}
                  sx={{ m: "15px 0 5px 20px" }}
                >
                  {item.description}
                </Typography>
              </Typography>
              <Box onClick={() => handleCustom(item._id)} color="white" className="box-cours">
                <Box backgroundColor={colors.blueAccent[400]} display="flex" justifyContent="space-between">
                  <Typography variant="h4" sx={{ m: "5px 0 5px 60px" }}>
                    Liste des cours
                  </Typography>
                  <Box sx={{ m: "5px 30px 5px 60px" }}>
                    <ArrowDropDownCircleOutlinedIcon className={customIcon} />
                  </Box>
                </Box>
              </Box>
              <Box className={custom} sx={{ m: "5px 0 5px 60px" }}>
                {item.cours?.map((element) => (
                  <React.Fragment key={element._id}>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="h4" sx={{ m: "15px 0 5px 20px" }}>
                        {element.titre}
                      </Typography>
                      <Typography variant="h6" sx={{ m: "15px 0 5px 20px" }}>
                        20:30
                      </Typography>
                    </Box>
                    <Divider sx={{ height: 1, m: "20px" }} color={colors.grey[300]} />
                  </React.Fragment>
                ))}
              </Box>
            </React.Fragment>
          ))}
        </Box>
      </Box>
      <Calendrier />
    </Box>
  );
};

export default DetailsEnsg;
