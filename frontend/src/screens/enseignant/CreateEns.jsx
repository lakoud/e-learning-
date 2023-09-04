import React, { useEffect, useRef, useState } from 'react';
import { Card, Container } from 'react-bootstrap';
import { useAddMutation } from '../../slices/EnsgApiSlice';
import { useNavigate, useLocation } from 'react-router-dom';
import Loader from '../../components/Loader';

export const CreateEns = () => {
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const location = useLocation();
  const redirectUrl = new URLSearchParams(location.search).get('redirect');

  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [numtel, setNumtel] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [add] = useAddMutation();

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await add({ nom, prenom, email, numtel, password }).unwrap();
      setIsLoading(false);
      navigate(redirectUrl || '/'); // Redirect to the specified URL or home page
    } catch (err) {
      setIsLoading(false);
      setError('Erreur lors de l\'ajout de l\'enseignant.'); // Handle the error here
      console.error(err);
    }
  };

  return (
    <Container>
      <Card>
        <form className="form" onSubmit={onSubmit} method="post" encType="multipart/form-data">
          <h4>Ajout enseignant</h4>
          <div className="form-group">
            <label htmlFor="nom">Nom</label>
            <input
              ref={inputRef}
              type="text"
              className="form-control"
              placeholder="Nom"
              name="nom"
              id="nom"
              required
              onChange={(e) => setNom(e.target.value)}
              value={nom}
            />
          </div>
          <div className="form-group">
            <label htmlFor="prenom">Prénom</label>
            <input
              type="text"
              className="form-control"
              placeholder="Prénom"
              name="prenom"
              id="prenom"
              required
              onChange={(e) => setPrenom(e.target.value)}
              value={prenom}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              name="email"
              id="email"
              required
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>
          <div className="form-group">
            <label htmlFor="numtel">Numéro de téléphone</label>
            <input
              type="number"
              className="form-control"
              placeholder="Numéro de téléphone"
              name="numtel"
              id="numtel"
              required
              onChange={(e) => setNumtel(e.target.value)}
              value={numtel}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="text"
              className="form-control"
              placeholder="Password"
              name="password"
              id="password"
              required
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>

          <div className="buttondiv">
            {isLoading && <Loader />}

            <button type="submit" className="bouton mb-2">
              Envoyer
            </button>
          </div>
        </form>
        {error && <div className="error-message">{error}</div>}
      </Card>
    </Container>
  );
};
