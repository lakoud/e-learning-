import express from "express"
import Formation from '../models/formationModel.js'
import mongoose from 'mongoose';

import {   

  supprimerFichier,
  ajouterMiniProjet,
  addFormation,
  deleteFormation,
  getFourmationById,
  getformation,
  updateFormation,
  getEleveInscritFormationById

} from "../controllers/formationController.js";

import { adminprotect } from "../middleware/authMiddleware.js"; 
import { protect } from "../middleware/EleveauthMiddleware.js"; 


const router=express.Router();

router.get('/:id',getFourmationById)
router.get('/',getformation)
router.route("/:id").put(adminprotect,updateFormation).delete(adminprotect, deleteFormation);
router.route('/').post(adminprotect,addFormation);

router.get('/eleves/:id',getEleveInscritFormationById)




//file

router.post('/upload/:formationId',protect, ajouterMiniProjet);
router.delete('/upload/:formationId/:miniProjetId/',protect, supprimerFichier);



export default router;