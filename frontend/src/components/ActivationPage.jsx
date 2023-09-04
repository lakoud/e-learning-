import React from 'react'
import { usePostMutation,useDeleteMutation } from '../slices/EleveApiSlice';

export const ActivationPage = () => {
    const [send, {isLoading}]= usePostMutation();
    const  onSubmit = async (e) => {
        e.preventDefault();
  
        try {
          await send({ nom, prenom, email, numtel, password })
            .unwrap()
            .then(() => {
              navigate('/Enseignants');
            })
        } catch (err) {
          console.log(err);
          seterr('Email déja existe !')
        }
      };
  
  return (
    <div>ActivationPage</div>
  )
}
