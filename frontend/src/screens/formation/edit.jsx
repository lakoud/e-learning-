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
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";

const EditFormation = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const [data, setData] = useState([]);
  const info = params.get("data");
  const [getInfo, { isLoading: isLoadingGetInfo }] = useGetMutation();

  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");
  const [selectedValue, setSelectedValue] = useState();
  const [ensgId, setEnsgId] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [update, { isLoading: isLoadingUpdate }] = useUpdateMutation();
  const [_id, setId] = useState("");

  const navigate = useNavigate();

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

  useEffect(() => {
    try {
      if (info) {
        const decodedData = JSON.parse(decodeURIComponent(info));
        console.log(decodedData);
        setNom(decodedData.nom);
        setDescription(decodedData.description);
        setEnsgId(decodedData.ensg._id);
        setId(decodedData._id);
      }
    } catch (error) {
      console.log(error);
    }
  }, [data]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      await update({ _id, nom, description, ensg: selectedValue }).unwrap();
      navigate("/Formations");
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
    console.log(event.target.value);
  };

  return (
    <Box m="20px">
      <Header
        title="Modifier Informations générales"
        subtitle="Modifier information générale"
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
        </Box>
        <Box display="flex" justifyContent="end" mt="20px">
          <Button type="submit" color="secondary" variant="contained">
            Modifier
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default EditFormation;
