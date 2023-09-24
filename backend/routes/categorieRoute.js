import express from "express"

import {   
    addCategorie,
    getcategorie,
    updateCategorie,
    deleteCategorie

} from "../controllers/categorieController.js";

import { adminprotect } from "../middleware/authMiddleware.js"; 
import { protect } from "../middleware/EleveauthMiddleware.js"; 


const router=express.Router();

router.route('/').post(adminprotect,addCategorie).put(adminprotect,updateCategorie);
router.get('/',getcategorie);
router.route('/:id').put(adminprotect,updateCategorie).delete(adminprotect,deleteCategorie);




export default router;