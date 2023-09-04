import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FormContainer } from "../../components/formContainer";
import { usePostMutation } from '../../slices/usersApiSlice';
import { setCredentials } from '../../slices/authSlice';
import { Alert, Box } from "@mui/material";
import Loader from '../../components/Loader';

export const ResetPassword = () => {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [send, { isLoading }] = usePostMutation();
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
            const res = await send({ email }).unwrap();
            navigate('/enterCode', { state: { param1: { email } } });
        } catch (err) {
            setErr(err.data.message);
        }
    };

    return (
        <div className="component">
        
            <FormContainer>
                <h1>Trouvez votre compte</h1>
                <p>Veuillez entrer votre adresse e-mail pour rechercher votre compte.</p>
                {err != null ? (
                    <Box sx={{ mb: '14px' }}>
                        <Alert severity="error">{err}</Alert>
                    </Box>
                ) : ''}
                <Form onSubmit={submitHandler}>
                    <Form.Group className="my-2" controlId="email">
                        <Form.Label>Email adress</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    {isLoading && <Loader />}
                    <Button type='submit' variant='light' className='mt-3 mx-3 '>
                        Annuler
                    </Button>
                    <Button type='submit' variant='primary' className='mt-3 '>
                        Recherche
                    </Button>
                </Form>
            </FormContainer>
        </div>
    );
};
