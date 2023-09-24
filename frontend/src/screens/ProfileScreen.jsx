import React from "react";
import {
  Box,
  Button,
  TextField,
  useTheme,
  Typography,
  Divider,
  Alert,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { tokens } from "../theme";
import { useSelector, useDispatch } from "react-redux";
import { useUpdateMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";

import person from "../assets/user.png";
export const ProfileScreen = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const data = params.get("data");
  const [name, setnom] = useState();
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [passwordConfirm, setpasswordConfirm] = useState("");

  const [err, seterr] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [update, { isLoading }] = useUpdateMutation();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    try {
      setnom(userInfo.name);
      setemail(userInfo.email);
      setpassword(userInfo.password);
    } catch (error) {
      console.log(error);
    }
  }, [data]);
  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      if (passwordConfirm != password) {
        seterr("Passwrd confirm inccorect");
      } else {
        const res = await update({ name, email, password }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate("/");
      }
    } catch (err) {
      seterr(err.data.message);
    }
  };
  return (
    <Box m="2% 5% 0 10%" height="100vh">
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
          {name}
        </Typography>
      </Box>

      <Box display="flex" justifyContent="center" alignItems="center">
        <Typography variant="h5" color={colors.greenAccent[400]}>
          Admin
        </Typography>
        <Divider sx={{ height: 3, m: "20px" }} color={colors.grey[300]} />
      </Box>
      <Box>
        <Box justifyContent="center" alignItems="center" sx={{ mb: "25px" }}>
          <Box
            sx={{ borderRadius: "10px", border: "1px solid black" }}
            justifyContent="center"
            alignItems="center"
          >
            {err != null ? (
              <Box sx={{ mb: "14px" }}>
                <Alert severity="error">{err}</Alert>
              </Box>
            ) : (
              ""
            )}

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
                  value={name}
                  name="name"
                  onChange={(e) => setnom(e.target.value)}
                  sx={{ gridColumn: "span 4" }}
                />

                <TextField
                  required
                  fullWidth
                  type="text"
                  label="Email"
                  onChange={(e) => setemail(e.target.value)}
                  value={email}
                  name="email"
                  sx={{ gridColumn: "span 4" }}
                />

                <TextField
                  type="password"
                  label="Password"
                  onChange={(e) => setpassword(e.target.value)}
                  value={password}
                  name="password"
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  type="password"
                  label="Confirm Password"
                  onChange={(e) => setpasswordConfirm(e.target.value)}
                  value={passwordConfirm}
                  name="password"
                  sx={{ gridColumn: "span 2" }}
                />
              </Box>
              <Box display="flex" justifyContent="end" padding="15px">
                <Button type="submit" color="info" variant="contained">
                  Modifier
                </Button>
              </Box>
            </form>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
