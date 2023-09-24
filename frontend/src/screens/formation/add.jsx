import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useLocation } from "react-router-dom";
import { useAddMutation } from "../../slices/formationApiSlice";
import { useNavigate } from "react-router-dom";
import { useGetMutation } from "../../slices/EnsgApiSlice";
import { useGetMutation  as usecategories} from "../../slices/categorieApiSlice";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";

const AddFormation = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const [nom, setNom] = useState("");
  const [add] = useAddMutation();
  const [data, setData] = useState([]);
  const [description, setDescription] = useState("");
  const [ensgId, setEnsgId] = useState("");
  const [getInfo, { isLoading }] = useGetMutation();
  const [getCategorie, { isLoadingCategorie }] = usecategories();
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();
  const [selectedValue, setSelectedValue] = useState();
  const [selectedCategorieValue, setselectedCategorieValue] = useState();

  useEffect(() => {
    const getHandler = async () => {
      try {
        const categorieData = await getCategorie();
        setCategories(categorieData.data);
      } catch (err) {
        console.log(err);
      }
    };

    getHandler();
  }, []);
  useEffect(() => {
    const getHandler = async () => {
      try {
        const userData = await getInfo();
        setData(userData.data);
      } catch (err) {
        console.log(err);
      }
    };

    getHandler();
  }, []);

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };
  const handleChangeCategorie = (event) => {
    setselectedCategorieValue(event.target.value);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    try {
      add({ nom, description, ensgId: selectedValue,categorieId: selectedCategorieValue})
        .unwrap()
        .then(() => navigate("/Formations"));
        toast.success("Formation ajoutée avec succès.");

      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
  };

  return (
    <Box m="2% 5% 0 10%" height="100vh"
 
    > 
      <Header
        title="Ajouter formation"
        subtitle="Ajouter une nouvelle formation"
      />

      <form onSubmit={handleFormSubmit}>
        <Box
          display="grid"
          gap="30px"
          gridTemplateColumns="repeat(4, minmax(0, 1fr))"
          sx={{
            "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
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
            sx={{ gridColumn: "span 4" }}
          />
          <TextField
            required
            fullWidth
            variant="filled"
            multiline
            type="text"
            label="Description"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            name="description"
            rows={5}
            sx={{ gridColumn: "span 4" }}
          />
   <Box
         
          gridTemplateColumns="repeat(4, minmax(0, 1fr))"
          sx={{
            "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
          }}
        >
          {isLoading && <Loader />}
          {data ? (
            <>
              <InputLabel id="select-label">Sélectionnez un enseignant</InputLabel>
              <Select
                labelId="select-label"
                id="select"
                value={selectedValue}
                onChange={handleChange}
                label="Sélectionnez une option"
              >
                {data?.map((item) => (
                  <MenuItem key={item._id} value={item._id}>
                    {item.nom}
                  </MenuItem>
                ))}
              </Select>
            </>
          ) : (
            ""
          )}</Box>
             <Box
         
          gridTemplateColumns="repeat(4, minmax(0, 1fr))"
          sx={{
            "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
          }}
        >
               {isLoadingCategorie && <Loader />}
          {categories ? (
            <>
              <InputLabel id="select-label">Sélectionnez Categorie</InputLabel>
              <Select
                labelId="select-label"
                id="select"
                value={selectedCategorieValue}
                onChange={handleChangeCategorie}
                label="Sélectionnez une option"
                
              >
                {categories?.map((item) => (
                  <MenuItem key={item._id} value={item._id}>
                    {item.nomCategorie}
                  </MenuItem>
                ))}
              </Select>
            </>
          ) : (
            ""
          )}</Box>
        </Box>
        <Box display="flex" justifyContent="end" mt="20px">
          <Button type="submit" color="info" variant="contained">
            Ajouter
          </Button>
        </Box>
      </form>
    </Box>
  );
};

const phoneRegExp =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

export default AddFormation;
