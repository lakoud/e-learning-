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
import { useUpdateMutation } from "../../slices/formationApiSlice";
import { useGetMutation } from "../../slices/EnsgApiSlice";
import { useGetMutation  as usecategories} from "../../slices/categorieApiSlice";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";

const EditFormation = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const [data, setData] = useState([]);
  const info = params.get("data");
  const [getInfo, { isLoading: isLoadingGetInfo }] = useGetMutation();
  
  const [getcategorie, { isLoading: isLoadingGetCategorie }] = usecategories();

  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");
  const [selectedValue, setSelectedValue] = useState("");
  const [ensgId, setEnsgId] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [update, { isLoading: isLoadingUpdate }] = useUpdateMutation();
  const [_id, setId] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategorieValue, setSelectedCategorieValue] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const getHandler = async () => {
      try {
        const catagorie = await getcategorie();
        setCategories(catagorie.data);
      } catch (err) {
        toast.error(err?.data?.message || err.error);
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
        toast.error(err?.data?.message || err.error);
      }
    };

    getHandler();
  }, []);

  useEffect(() => {
    try {
      if (info) {
        const decodedData = JSON.parse(decodeURIComponent(info));
        setNom(decodedData.nom);
        setDescription(decodedData.description);
        setSelectedValue(decodedData.ensg._id);
        setSelectedCategorieValue(decodedData.categorie._id);

        setId(decodedData._id);
      }
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  }, [data]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      await update({ _id, nom, description, ensg: selectedValue,categorieId:selectedCategorieValue }).unwrap();
      navigate("/Formations");
      toast.success("Formation modifiée avec succès.");

    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };
  const handleChangeCategorie = (event) => {
    setSelectedCategorieValue(event.target.value);
  };
  
  return (
    <Box m="2% 5% 0 10%" height="100vh"
 
    > 
      <Header
        title="Modifier Foramtion "
        subtitle="Modifier"
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

          {isLoadingUpdate && <Loader />}
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
          )}



{isLoadingGetCategorie && <Loader />}
          {categories ? (
            <>
              <InputLabel id="select-label">Sélectionnez Catégorie</InputLabel>
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
          )}
        </Box>
        <Box display="flex" justifyContent="end" mt="20px">
          <Button type="submit" color="info" variant="contained">
            Modifier
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default EditFormation;
