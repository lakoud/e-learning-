import express from "express"
import Info from '../models/infoModel.js'
import mongoose from 'mongoose';

import {   

  updateEnsg,
  addEnsg,
  getEnsgs,getEnsgProfile,authEnsg
    ,updateEnsgProfile,
    logoutEnsg,
    supprimerensg

} from "../controllers/ensgController.js";


import { protect } from "../middleware/EnsgauthMiddleware.js"; 
import { adminprotect } from "../middleware/authMiddleware.js"; 
const router=express.Router();

router.route('/profile').get(protect,getEnsgProfile).put(protect,updateEnsgProfile);
router.post('/auth',authEnsg)

router.route('/add').post(adminprotect,addEnsg);

router.get('/get',getEnsgs)

router.post('/logout',logoutEnsg)

router.route('/:id').delete(adminprotect,supprimerensg).put(updateEnsg);


export default router;