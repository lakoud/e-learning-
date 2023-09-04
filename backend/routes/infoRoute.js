import express from "express"
import Info from '../models/infoModel.js'
import mongoose from 'mongoose';

import {   


    addInfo,
    getInfo,
    updateInfo,
    deleteInfo

} from "../controllers/infoController.js";

 import { adminprotect } from "../middleware/authMiddleware.js"; 
const router=express.Router();



router.get('/get',getInfo)

router.route('/').post(adminprotect,addInfo);


 router.route('/:id').put(adminprotect,updateInfo).delete(adminprotect,deleteInfo);


export default router;