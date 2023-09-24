import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FormContainer } from "../../components/formContainer";
import { useSendMutation } from '../../slices/usersApiSlice';
import { setCredentials } from '../../slices/authSlice';
import { toast } from "react-toastify";
import Loader from '../../components/Loader';
import { useLocation } from 'react-router-dom';
import { Alert, Box } from "@mui/material";
import Footer from "../global/Footer";

export const EnterCode = () => {
    const location = useLocation();
    const { param1 } = location.state ?? '';
    const [resetPassword, setCode] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [send, { isLoading }] = useSendMutation();
    const { userInfo } = useSelector((state) => state.auth);
    const [err, setErr] = useState(null);

    useEffect(() => {
        if (userInfo) {
            navigate('/');
        }
        setEmail(param1?.email);

    }, [navigate, userInfo]);

    const submitHandler = async (e) => {
        e.preventDefault();

        try {
            const res = await send({ resetPassword, email }).unwrap();
            navigate('/newPassword', { state: { param1: { email } } });
        } catch (err) {
            setErr(err.data.message);
        }
    };

    return (<>      
        <div className="component">
        
            <FormContainer>
                <h1>Entrez le code de sécurité</h1>
                <p>Merci de vérifier dans vos e-mails que vous avez reçu un message avec votre code. Celui-ci est composé de 6 caractères.</p>
                {err != null ? (
                    <Box sx={{ mb: '14px' }}>
                        <Alert severity="error">{err}</Alert>
                    </Box>
                ) : ''}
                <Form onSubmit={submitHandler}>
                    <Form.Group className="my-2" controlId="resetPassword">
                        <Form.Control
                            type="resetPassword"
                            placeholder="Enter code"
                            value={resetPassword}
                            onChange={(e) => setCode(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    <Box>
                        Nous avons envoyé votre code à : {param1?.email ?? ' '}
                        <Box>
                            <Link to="/resetPassword">Code non reçu ?</Link>
                        </Box>
                    </Box>
                    {isLoading && <Loader />}
                    <div className="buttons">
                        
                        <Button type='submit' variant='primary' className='mt-3 '>
                            Recherche
                        </Button>
                        <Link to='/login' variant='light' className='mt-3 annuler-button '>
                            Annuler
                        </Link>
                        </div>
                </Form>
            </FormContainer>
        </div><Footer />
    </>
    );
};
