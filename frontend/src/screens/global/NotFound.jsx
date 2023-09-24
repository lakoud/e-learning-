import React from 'react'
import notfound  from '../../assets/notfound.png'
import { Button } from '@mui/material'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className='not-found'>
        <div className='not-found-child'>
            <img src={notfound}></img>
            <div>          
          <Link className='not-found-button' to='/'>Retour a la page d'accueil </Link>
            </div>
            </div>

    </div>
  )
}

export default NotFound