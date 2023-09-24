import React, { useState, useEffect } from "react";
import { Box, Button, TextField } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useUpdateMutation } from "../../slices/InfoApiSlice";
import { toast } from "react-toastify";

const Edit = () => {
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
  const [update, { isLoading }] = useUpdateMutation();
  const navigate = useNavigate();
  const [ _id ,setid]=useState('');
  
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const data = params.get('data');

  useEffect(() => {
    try {
      if (data) {
        const decodedData = JSON.parse(decodeURIComponent(data));
        settitle(decodedData.titre);
        setdescription(decodedData.description);
        setadresse(decodedData.address);
        setemail(decodedData.email);
        setnumtel(decodedData.numtel);
        setyoutube(decodedData.youtube);
        setlinkedin(decodedData.linkedin);
        setinstgram(decodedData.instgram);
        setfacebook(decodedData.facebook);
        setid(decodedData._id);
      }
    } catch (error) {
      console.log(error);
    }
  }, [data]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      await update({_id,titre,description,adresse,email,numtel,facebook,youtube,instgram,linkedin});
      toast.success("Information modifiée avec succès.");
      navigate('/InfoGenrale')

    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <Box m="2% 5% 0 10%" height="100vh"
 
    > 
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
            type="text"
            label="Titre"
            onChange={(e) => settitle(e.target.value)}
            value={titre}
            name="titre"
            sx={{ gridColumn: "span 4" }}
          />
          <TextField
            fullWidth
            multiline
            type="text"
            label="Description"
            onChange={(e) => setdescription(e.target.value)}
            value={description}
            name="description"
            rows={5}
            sx={{ gridColumn: "span 4" }}
          />
          <TextField
            fullWidth
            type="text"
            label="Email"
            onChange={(e) => setemail(e.target.value)}
            value={email}
            name="email"
            sx={{ gridColumn: "span 2" }}
          />
          <TextField
            fullWidth
            type="text"
            label="Contact Number"
            onChange={(e) => setnumtel(e.target.value)}
            value={numtel}
            name="numtel"
            sx={{ gridColumn: "span 2" }}
          />
          <TextField
            fullWidth
            type="text"
            label="Address 1"
            onChange={(e) => setadresse(e.target.value)}
            value={adresse}
            name="address"
            sx={{ gridColumn: "span 4" }}
          />
          <TextField
            fullWidth
            type="text"
            label="Youtube link"
            onChange={(e) => setyoutube(e.target.value)}
            value={youtube}
            name="Youtube"
            sx={{ gridColumn: "span 1" }}
          />
          <TextField
            fullWidth
            type="text"
            label="Facebook link"
            onChange={(e) => setfacebook(e.target.value)}
            value={facebook}
            name="facebook"
            sx={{ gridColumn: "span 1" }}
          />
          <TextField
            fullWidth
            type="text"
            label="Instagram link"
            onChange={(e) => setinstgram(e.target.value)}
            value={instgram}
            name="instgram"
            sx={{ gridColumn: "span 1" }}
          />
          <TextField
            fullWidth
            type="text"
            label="Linkedin link"
            onChange={(e) => setlinkedin(e.target.value)}
            value={linkedin}
            name="linkedin"
            sx={{ gridColumn: "span 1" }}
          />
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

export default Edit;
