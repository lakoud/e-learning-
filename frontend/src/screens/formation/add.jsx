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
import Loader from "../../components/Loader";

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
  const navigate = useNavigate();
  const [selectedValue, setSelectedValue] = useState();

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

  const handleFormSubmit = (event) => {
    event.preventDefault();
    setEnsgId("64d3af8151c6cbb428b79946");

    try {
      add({ nom, description, ensgId: selectedValue })
        .unwrap()
        .then(() => navigate("/Formations"));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box m="20px">
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
          )}
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

const phoneRegExp =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

export default AddFormation;
