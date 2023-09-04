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
    <Box m="20px">
      <Box display="flex" justifyContent="center" alignItems="center">
        <img
          alt="profile-user"
          width="200px"
          height="200px"
          src={person}
          style={{ cursor: "pointer", borderRadius: "50%" }}
        />
      </Box>

      <Box display="flex" justifyContent="center" alignItems="center">
        <Typography
          variant="h2"
          color={colors.grey[100]}
          fontWeight="bold"
          sx={{ mb: "5px" }}
        >
          {nom + ' ' + prenom}
        </Typography>
      </Box>

      <Box display="flex" justifyContent="center" alignItems="center">
        <Typography variant="h5" color={colors.greenAccent[400]}>
          Enseignant
        </Typography>
        <Divider sx={{ height: 3, m: "20px" }} color={colors.grey[300]} />
      </Box>

      <Box>
        <Box justifyContent="center" alignItems="center" sx={{ mb: "25px" }}>
          <Box
            sx={{ borderRadius: '10px', border: '1px solid black' }}
            justifyContent="center"
            alignItems="center"
          >
            {edit ? (
              <Box>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="space-between"
                >
                  <Typography
                    variant="h5"
                    color={colors.grey[300]}
                    sx={{ m: "15px 0 5px 20px" }}
                  >
                    Email :{" "}
                    <Typography
                      variant="h5"
                      color={colors.grey[100]}
                      sx={{ m: "15px 0 5px 20px" }}
                    >
                      {email}
                    </Typography>
                  </Typography>
                  <Box padding={"10px"} className="edit-icon" onClick={() => setEdit(!edit)}>
                    <EditTwoToneIcon />
                  </Box>
                </Box>

                <Typography
                  variant="h5"
                  color={colors.grey[300]}
                  sx={{ m: "15px 0 5px 20px" }}
                >
                  Mot de passe :{" "}
                  <Typography
                    variant="h5"
                    color={colors.grey[100]}
                    sx={{ m: "15px 0 5px 20px" }}
                  >
                    {password}
                  </Typography>
                </Typography>
                <Typography
                  variant="h5"
                  color={colors.grey[300]}
                  sx={{ m: "15px 0 5px 20px" }}
                >
                  Numéro de téléphone :{" "}
                  <Typography
                    variant="h5"
                    color={colors.grey[100]}
                    sx={{ m: "15px 0 5px 20px" }}
                  >
                    {numtel}
                  </Typography>
                </Typography>
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
                  <Button type="submit" color="secondary" variant="contained">
                    Modifier
                  </Button>
                </Box>
              </form>
            )}
          </Box>
        </Box>

        <Box onClick={handleCustomFormation} className="formatioons-box" display="flex" justifyContent="space-between" backgroundColor={colors.greenAccent[400]}>
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
                  <Box padding={"10px"}>
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
                <Box backgroundColor={colors.greenAccent[400]} display="flex" justifyContent="space-between">
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
