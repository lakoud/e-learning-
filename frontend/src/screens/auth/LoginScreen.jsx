import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useLoginMutation } from '../../slices/usersApiSlice';
import { setCredentials } from '../../slices/authSlice';
import Loader from '../../components/Loader';
import { Alert, Box, useTheme } from "@mui/material";
import Footer from "../global/Footer";
import logo from '../../assets/logo.png';
import { tokens } from "../../theme";

const LoginScreen = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const [err, setErr] = useState(null);

  useEffect(() => {
    if (userInfo) {
      navigate('/');
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate('/');
    } catch (err) {
      setErr(err.data.message);
    }
  };

  return (
    <>
      <div className="mb-4 mx-2">
        <FormContainer>
          <img
            alt="Logo"
            height="100px"
            src={logo}
            style={{ cursor: "pointer", marginBottom: "15px" }}
          />
          {err != null ? (
            <Box sx={{ mb: '14px' }}>
              <Alert severity="error">{err}</Alert>
            </Box>
          ) : ''}
          <Form onSubmit={submitHandler}>
            <Form.Group className="my-2" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="my-2" controlId="password">
              <Form.Label>Mot de passe</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Row className="px-3 text-end">
              <Col>
                <Link to="/resetPassword" style={{ textDecoration: 'none', color: colors.grey[700] }}>
                  Réinitialiser le mot de passe
                </Link>
              </Col>
            </Row>
            {isLoading && <Loader />}
            <Button type='submit' variant='primary' className='mt-3'>
              Connexion
            </Button>
          </Form>
        </FormContainer>
      </div>
      <Footer />
    </>
  );
}

export default LoginScreen;
