import express from "express"
import {   
  modifyPassword,
  writeNewPassword,
  resetPassword,
  verifyUser,
  ajoutNoteQuiz,
    authUser,
    updateUserProfile,
    logoutUser,
    registerUser,
    getUserProfile,
    getAllEleves,
    getEleveById,
    addFavoriteFormation,
    nouvelleInscription,
    deleteEleve,
    DemanderRendezVous,

} from "../controllers/elveController.js";
import { protect } from "../middleware/EleveauthMiddleware.js"; 
import Eleve from "../models/eleveModel.js";
import { adminprotect } from "../middleware/authMiddleware.js"; 
import nodemailer from 'nodemailer';

const router=express.Router();

router.post('/',registerUser)
router.post('/auth',authUser)
router.post('/logout',logoutUser)
router.route('/profile').get(protect,getUserProfile).put(protect,updateUserProfile);
router.route('/favorite').put(protect,addFavoriteFormation).put(protect,updateUserProfile);

router.get('/:id',getEleveById)

router.route('/inscription').post(protect,nouvelleInscription);

router.get('/',getAllEleves)

router.route('/:id').delete(adminprotect,deleteEleve);

  
router.route('/note/:formationId/:coursId').post(protect,ajoutNoteQuiz);


router.post('/verifierCompte/:activationCode', verifyUser);
router.post('/resetPassword', resetPassword);

router.post('/resetPassword',resetPassword)
router.post('/writePassword',writeNewPassword)

router.route('/modifierPassword').post(protect,modifyPassword);



router.route('/rendezvous/:ensgId').post(protect,DemanderRendezVous);




export default router;