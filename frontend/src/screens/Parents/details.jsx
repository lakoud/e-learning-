import React, { useState, useEffect } from "react";
import { Box, Typography, Divider, IconButton, useTheme } from "@mui/material";
import person from "../../assets/user.png";
import { useLocation, useNavigate } from "react-router-dom";
import { useUpdateMutation } from "../../slices/InfoApiSlice";
import { tokens } from "../../theme";
import ArrowDropDownCircleOutlinedIcon from "@mui/icons-material/ArrowDropDownCircleOutlined";
import useMediaQuery from "@mui/material/useMediaQuery";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const DetailsParent = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const data = params.get("data");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [genre, setGenre] = useState("");
  const [createdAt, setcreatedAt] = useState("");
  const [numtel, setNumtel] = useState("");
  const [inscription, setInscription] = useState([]);
  const navigate = useNavigate();
  const [update, { isLoading }] = useUpdateMutation();
  const [id, setId] = useState("");
  const [customFormation, setCustomFormation] = useState("customformaton-none");
  const [customIconFormation, setCustomIconFormation] = useState("");
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const handleCustomFormation = () => {
    if (customFormation === "customformaton-show") {
      setCustomFormation("customformaton-none");
      setCustomIconFormation("");
    } else {
      setCustomFormation("customformaton-show");
      setCustomIconFormation("arowicon");
    }
  };

  useEffect(() => {
    try {
      if (data) {
        const decodedData = JSON.parse(decodeURIComponent(data));
        setId(decodedData._id);
        setNom(decodedData.nom);
        setPrenom(decodedData.prenom);
        setEmail(decodedData.email);
        setNumtel(decodedData.numtel);
        setGenre(decodedData.genre);
        setcreatedAt(decodedData.createdAt);
        setInscription(decodedData.enfants);
      }
    } catch (error) {
      console.error(error);
    }
  }, [data]);

  const details = (objet) => {
    const encodedData = encodeURIComponent(JSON.stringify(objet));
    navigate(`/DetailsEleve?data=${encodedData}`);
  };
  return (
    <Box m="2% 5% 0 10%" height="100vh">
      <Box
        display={isNonMobile ? "flex" : ""}
        gap={"15px"}
        padding={"15px"}
        sx={{
          padding: "15px ",
          margin: "auto",
        }}
      >
        <Box
          sx={{
            padding: "15px ",
            margin: "auto",
          }}
        >
          <Box>
            <img
              alt="profile-user"
              width="200px"
              height="200px"
              src={person}
              style={{ borderRadius: "50%", marginRight: "25px" }}
            />
          </Box>

          <Box>
            <Typography
              variant="h2"
              color={colors.grey[100]}
              fontWeight="bold"
              sx={{ mt: "10px" }}
            >
              {nom}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            borderLeft: "1px solid rgba(0, 0, 0, 0.1)",
            boxShadow: "2px 2px 2px  rgba(0, 0, 0, 0.1)",
            padding: "15px ",
            width: "100%",
            marginTop: "15px",
          }}
        >
          <Box display={isNonMobile ? "flex" : ""}>
            <Typography
              variant="h5"
              color={colors.grey[300]}
              fontWeight="bold"
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
          <Box display={isNonMobile ? "flex" : ""}>
            <Typography
              variant="h5"
              color={colors.grey[300]}
              fontWeight="bold"
              sx={{ m: "15px 0 5px 20px" }}
            >
              ID :
            </Typography>
            <Typography
              variant="h5"
              color={colors.grey[100]}
              sx={{
                m: "15px 0 5px 20px",
                maxWidth: "100%",
                overflowWrap: "break-word",
              }}
            >
              {id}
            </Typography>
          </Box>
          <Divider color={colors.grey[900]} />

          <Box display={isNonMobile ? "flex" : ""}>
            <Typography
              fontWeight="bold"
              variant="h5"
              color={colors.grey[300]}
              sx={{
                m: "15px 0 5px 20px",
                maxWidth: "100%",
                width: "100%",
                overflowWrap: "break-word",
              }}
            >
              Numéro de téléphone :
              <Typography
                variant="h5"
                color={colors.grey[100]}
                sx={{ mt: "15px ", width: "100%", width: "100%" }}
              >
                {numtel}
              </Typography>
            </Typography>

            <Typography
              variant="h5"
              fontWeight="bold"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px", width: "100%" }}
            >
              Genre :
              <Typography
                variant="h5"
                color={colors.grey[100]}
                sx={{ mt: "15px ", width: "100%" }}
              >
                {genre}
              </Typography>
            </Typography>
          </Box>
          <Box display={isNonMobile ? "flex" : ""}>
            <Typography
              fontWeight="bold"
              variant="h5"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px", maxWidth: "100%" }}
            >
              Date de création:
              <Typography
                variant="h5"
                color={colors.grey[100]}
                sx={{
                  mt: "15px ",
                  maxWidth: "100%",
                  overflowWrap: "break-word",
                }}
              >
                {createdAt}
              </Typography>
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box
        onClick={handleCustomFormation}
        className="formatioons-box"
        display={isNonMobile ? "flex" : ""}
        justifyContent="space-between"
        backgroundColor={colors.blueAccent[400]}
        sx={{ mb: "15px " }}
      >
        <Typography variant="h3" sx={{ m: "5px 0 5px 20px" }}>
          Enfants
        </Typography>
        <Box sx={{ m: "5px 30px 5px 60px" }}>
          <ArrowDropDownCircleOutlinedIcon className={customIconFormation} />
        </Box>
      </Box>
      <Box className={customFormation}>
        {inscription?.map((item) => (
          <>
            <Typography
              variant="h3"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              <Box
                justifyContent="space-between"
                display={isNonMobile ? "flex" : ""}
              >
                <Typography
                  variant="h5"
                  color={colors.greenAccent[400]}
                  sx={{ m: "15px 0 5px 20px" }}
                >
                  {item.nom + " " + item.prenom}
                </Typography>

                <Box
                  padding={"10px"}
                  className="action-icon"
                  onClick={() => details(item)}
                >
                  <InfoOutlinedIcon />
                </Box>
              </Box>
            </Typography>
            <Box display={isNonMobile ? "flex" : ""}>
              <Typography
                variant="h5"
                color={colors.grey[300]}
                fontWeight="bold"
                sx={{ m: "15px 0 5px 20px" }}
              >
                ID :
              </Typography>
              <Typography
                variant="h5"
                color={colors.grey[100]}
                sx={{ m: "15px 0 5px 20px" }}
              >
                {item._id}
              </Typography>
            </Box>
            {item.email ? (
              <Box display={isNonMobile ? "flex" : ""}>
                <Typography
                  variant="h5"
                  color={colors.grey[300]}
                  fontWeight="bold"
                  sx={{ m: "15px 0 5px 20px" }}
                >
                  Email :
                </Typography>
                <Typography
                  variant="h5"
                  color={colors.grey[100]}
                  sx={{ m: "15px 0 5px 20px" }}
                >
                  {item.email}
                </Typography>
              </Box>
            ) : (
              ""
            )}

            <Box display={isNonMobile ? "flex" : ""}>
              <Typography
                variant="h5"
                color={colors.grey[300]}
                fontWeight="bold"
                sx={{ m: "15px 0 5px 20px" }}
              >
                Date de naissance :
              </Typography>
              <Typography
                variant="h5"
                color={colors.grey[100]}
                sx={{ m: "15px 0 5px 20px" }}
              >
                {item.datedenaissance}
              </Typography>
            </Box>
            <Box display={isNonMobile ? "flex" : ""}>
              <Typography
                variant="h5"
                color={colors.grey[300]}
                fontWeight="bold"
                sx={{ m: "15px 0 5px 20px" }}
              >
                Nv etude :
              </Typography>
              <Typography
                variant="h5"
                color={colors.grey[100]}
                sx={{ m: "15px 0 5px 20px" }}
              >
                {item.nvEtude}
              </Typography>
            </Box>

            <Box
              onClick={() => handlCustom(item._id)}
              color="white"
              className="box-cours"
            ></Box>
            <Divider sx={{ height: 3, m: "20px" }} color={colors.grey[300]} />
          </>
        ))}
      </Box>
    </Box>
  );
};

export default DetailsParent;
