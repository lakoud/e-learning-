import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FormContainer } from "../../components/formContainer";
import { useModifierMutation } from '../../slices/usersApiSlice';
import { setCredentials } from '../../slices/authSlice';
import { toast } from "react-toastify";
import Loader from '../../components/Loader';

export const NewPassword = () => {
  const location = useLocation();
  const { param1 } = location.state ?? '';
  const [passwordConfirm, setpasswordConfirm] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [modifier, { isLoading }] = useModifierMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (userInfo) {
      navigate('/');
    }
    setEmail(param1?.email);
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      if (passwordConfirm !== password) {
        toast.error("Les mots de passe ne correspondent pas.");
      }
      const res = await modifier({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate('/');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="component">
      <nav className="navbar">
        <div className="logo">Logo</div>
      </nav>
      <FormContainer>
        <h1>Choisissez un nouveau mot de passe</h1>
        <p>Créez un mot de passe d’au moins 6 caractères. Un mot de passe fort est une combinaison de lettres, de chiffres et de signes de ponctuation.</p>
        <Form onSubmit={submitHandler}>
          <Form.Group className="my-2" controlId="password">
            <Form.Label>Nouveau mot de passe</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group className="my-2" controlId="passwordConfirm">
            <Form.Label>Confirmer mot de passe</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter passwordConfirm"
              value={passwordConfirm}
              onChange={(e) => setpasswordConfirm(e.target.value)}
            ></Form.Control>
          </Form.Group>

          {isLoading && <Loader />}
          <Row className="px-3 ">
            <Col>
              <Link to="/login">Annuler</Link>
            </Col>
          </Row>
          <Button type='submit' variant='primary' className='mt-3'>
            Confirmer
          </Button>
        </Form>
      </FormContainer>
    </div>
  );
}
