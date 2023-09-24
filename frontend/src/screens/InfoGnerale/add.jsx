import React, { useState, useEffect } from "react";
import { Box, Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { toast } from "react-toastify";
import Header from "../../components/Header";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useAddMutation } from "../../slices/InfoApiSlice";

const Add = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [titre, settitle] = useState("");
  const [description, setdescription] = useState("");
  const [adresse, setadresse] = useState("");
  const [email, setemail] = useState("");
  const [numtel, setnumtel] = useState("");
  const [facebook, setfacebook] = useState("");
  const [youtube, setyoutube] = useState("");
  const [instgram, setinstgram] = useState("");
  const [linkedin, setlinkedin] = useState("");

  const [add, { isLoading }] = useAddMutation();
  const navigate = useNavigate();

  useEffect(() => {
    // If you need to do something on component mount, put it here
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      await add({
        titre,
        description,
        adresse,
        email,
        numtel,
        facebook,
        youtube,
        instgram,
        linkedin,
      }).unwrap();

      navigate("/InfoGenrale");
      toast.success("Information ajoutée avec succès.");

    } catch (err) {
      toast.error(err?.data?.message || err.error);
      console.log(err)
    }
  };

  return (
<Box m="2% 5% 0 10%" height="100vh"
 
 > 
      <Header
        title="Ajouter Informations générales"
        subtitle="Ajouter informations générales"
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
            label="Titre"
            required
            value={titre}
            onChange={(e) => settitle(e.target.value)}
            sx={{ gridColumn: "span 4" }}
          />
          <TextField
            required
            fullWidth
            variant="filled"
            multiline
            type="text"
            label="Description"
            onChange={(e) => setdescription(e.target.value)}
            value={description}
            rows={5}
            sx={{ gridColumn: "span 4" }}
          />
          <TextField
            required
            fullWidth
            variant="filled"
            type="text"
            label="Email"
            onChange={(e) => setemail(e.target.value)}
            value={email}
            sx={{ gridColumn: "span 2" }}
          />
          <TextField
            required
            fullWidth
            variant="filled"
            type="text"
            label="Contact Number"
            onChange={(e) => setnumtel(e.target.value)}
            value={numtel}
            sx={{ gridColumn: "span 2" }}
          />
          <TextField
            required
            fullWidth
            variant="filled"
            type="text"
            label="Address 1"
            onChange={(e) => setadresse(e.target.value)}
            value={adresse}
            sx={{ gridColumn: "span 4" }}
          />
          <TextField
            fullWidth
            variant="filled"
            type="text"
            label="Youtube link"
            onChange={(e) => setyoutube(e.target.value)}
            value={youtube}
            sx={{ gridColumn: "span 1" }}
          />
          <TextField
            fullWidth
            variant="filled"
            type="text"
            label="Facebook link"
            onChange={(e) => setfacebook(e.target.value)}
            value={facebook}
            sx={{ gridColumn: "span 1" }}
          />
          <TextField
            fullWidth
            variant="filled"
            type="text"
            label="Instagram link"
            onChange={(e) => setinstgram(e.target.value)}
            value={instgram}
            sx={{ gridColumn: "span 1" }}
          />
          <TextField
            fullWidth
            variant="filled"
            type="text"
            label="LinkedIn link"
            onChange={(e) => setlinkedin(e.target.value)}
            value={linkedin}
            sx={{ gridColumn: "span 1" }}
          />
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

const checkoutSchema = yup.object().shape({
  titre: yup.string().required("required"),
  description: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  numtel: yup.string().matches(phoneRegExp, "Phone number is not valid").required("required"),
  adresse: yup.string().required("required"),
  facebook: yup.string(),
  youtube: yup.string(),
  instgram: yup.string(),
  linkedin: yup.string(),
});

export default Add;
