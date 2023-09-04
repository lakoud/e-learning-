import express from "express"
import Formation from '../models/formationModel.js'
import mongoose from 'mongoose';

import {   
  deleteExerciceAuCours,
  ajouterExerciceAuCours,
  modifierQuestionQuizduCours,
  supprimerQuestionduQuiz,
  creeQuizAuCours,
  ajouterCoursAFormation,
  supprimerCoursDeFormation,
  updateCoursDeFormation,
  getCoursDeFormationById,
  ajouterCommentaireAuCours,
  supprimerCommentaireAuCours,
  modifierCommentaireAuCours
} from "../controllers/formationController.js";
import { protect } from "../middleware/EnsgauthMiddleware.js"; 
import { protecteleve } from "../middleware/EleveauthMiddleware.js"; 
import { adminprotect } from "../middleware/authMiddleware.js"; 


const router=express.Router();





router.get('/:id/:coursId',getCoursDeFormationById)

router.route('/').post(protect,ajouterCoursAFormation);
router.route('/:id/:coursId').put(protect,updateCoursDeFormation).delete(protect, supprimerCoursDeFormation);



//commentaire
router.route('/:formationId/:coursId').post(protect,protecteleve,ajouterCommentaireAuCours).delete(protect, supprimerCoursDeFormation);

router.route('/:formationId/:coursId/:commentaireId').delete(protect,protecteleve,supprimerCommentaireAuCours).put(protect,protecteleve,modifierCommentaireAuCours)




// Quiz

router.route('quiz/:formationId/:coursId').post(protect,creeQuizAuCours);
router.route('quiz/:formationId/:coursId/:questionId').put(protect,modifierQuestionQuizduCours).delete(protect,supprimerQuestionduQuiz)




//exercice 

router.route('/exercices/:formationId/:coursId').post(protect,ajouterExerciceAuCours).put(protect,ajouterExerciceAuCours).delete(protect,deleteExerciceAuCours)


export default router;