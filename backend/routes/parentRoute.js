import express from "express"
import {   
  modifyPassword,
  writeNewPassword,
  resetPassword,
  verifyUser,
    authUser,
    updateUserProfile,
    logoutUser,
    registerUser,
    getUserProfile,
    addenfantWithID,
    deleteParent,
    addenfantexist,
    getAllParents

} from "../controllers/parentController.js";
import { protect } from "../middleware/ParentauthMiddleware.js"; 
import Eleve from "../models/eleveModel.js";
import { adminprotect } from "../middleware/authMiddleware.js"; 
import nodemailer from 'nodemailer';

const router=express.Router();

router.post('/',registerUser)
router.post('/auth',authUser)
router.post('/logout',logoutUser)
router.route('/profile').get(protect,getUserProfile).put(protect,updateUserProfile);
router.route('/enfants').put(protect,addenfantWithID)
router.route('/enfantsExiste').put(protect,addenfantexist)




router.route('/:id').delete(adminprotect,deleteParent);

  
router.get('/', getAllParents);


router.post('/verifierCompte/:activationCode', verifyUser);
router.post('/resetPassword', resetPassword);

router.post('/resetPassword',resetPassword)
router.post('/writePassword',writeNewPassword)

router.route('/modifierPassword').post(protect,modifyPassword);

export default router;