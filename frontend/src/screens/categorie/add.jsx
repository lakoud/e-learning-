import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useLocation } from "react-router-dom";
import { useAddMutation } from "../../slices/categorieApiSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AddCategorie = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [nomCategorie, setnomCategorie] = useState("");
  const [add] = useAddMutation();
  const navigate = useNavigate();



  const handleFormSubmit = (event) => {
    event.preventDefault();

    try {
      add({ nomCategorie  })
        .unwrap()
        .then(() => navigate("/Categories"));
        toast.success("Catégorie ajoutée avec succès.");

    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <Box m="20px">
      <Header
        title="Ajouter Catégorie"
        subtitle="Ajouter une nouvelle Catégorie"
      />

      <form onSubmit={handleFormSubmit}>
        <Box
          display="grid"
          gap="30px"
          gridTemplateColumns="repeat(4, minmax(0, 1fr))"
          sx={{
            "& > div": { gridColumn: isNonMobile ? undefined : "span 2" },
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
            sx={{ gridColumn: "span 2" }}
          />
          {/* <TextField
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
          /> */}

        </Box>
        <Box display="flex" justifyContent="center" mt="20px">
          <Button type="submit" color="secondary" variant="contained">
            Ajouter
          </Button>
        </Box>
      </form>
    </Box>
  );
};


export default AddCategorie;
