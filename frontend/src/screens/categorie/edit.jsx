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
import { useUpdateMutation } from "../../slices/categorieApiSlice";
import { useGetMutation } from "../../slices/EnsgApiSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const EditCategorie = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const [data, setData] = useState([]);
  const info = params.get("data");
  const [nomCategorie, setnomCategorie] = useState("");
  const [update, { isLoading: isLoadingUpdate }] = useUpdateMutation();
  const [_id, setId] = useState("");

  const navigate = useNavigate();


  useEffect(() => {
    try {
      if (info) {
        const decodedData = JSON.parse(decodeURIComponent(info));
        console.log(decodedData);
        setnomCategorie(decodedData.nomCategorie);
        setId(decodedData._id);
      }
    } catch (error) {
      console.log(error);
    }
  }, [data]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      await update({ _id, nomCategorie}).unwrap();
      navigate("/Categories");
      toast.success("Catégorie modifiée avec succès.");

    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };


  return (
    <Box m="20px">
      <Header
        title="Modifier Catégorie"
        subtitle="Modifier Catégorie"
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
            label="nomCategorie"
            required
            value={nomCategorie}
            name="nomCategorie"
            onChange={(e) => setnomCategorie(e.target.value)}
            sx={{ gridColumn: "span 4" }}
          />
      

        
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

export default EditCategorie;
