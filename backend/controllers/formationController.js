import asyncHandler from "express-async-handler"
import Formation from "../models/formationModel.js";
import Ensg from "../models/ensgModel.js";
import Cours from "../models/courModel.js";
import multer from 'multer';
import fs from 'fs';
import Eleve from '../models/eleveModel.js'
import User from "../models/userModel.js";
import Categorie from "../models/CategorieModel.js";


/**
 * @desc add info
 *  @route POST /api/info
 *  @methode POST
 *  @acces private
 */

const addFormation = asyncHandler(async (req, res) => {
  try {
    const { nom, description, ensgId,categorieId ,prix} = req.body;

    const ensg = await Ensg.findById(ensgId);

    if (!ensg) {
      return res.status(404).json({ message: 'ensg not found' });
    }
    const categorie = await Categorie.findById(categorieId);

    if (!categorie) {
      return res.status(404).json({ message: 'Categorie not found' });
    }
    const formation = new Formation({
      prix,
      nom,
      description,
      ensg: ensg._id,
      categorie:categorie._id
    });

    await formation.save();

    res.status(201).json(formation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @desc  Get  foramtion
 *  @route  /api/formation/
 *  @methode GET
 *  @acces Private
 */

const getformation= asyncHandler( async (req,res) => {
  const formation = await Formation.find()
  .populate('ensg', 'nom prenom')
  .populate('categorie', 'nomCategorie');    
      
    res.status(200).json(formation)
  });


/**
*  @desc Update  formation
*  @route PUT /api/formation/:id
*  @methode PUT
*  @acces Private
*/

const updateFormation= asyncHandler( async (req, res) => {
    const idToUpdate = req.params.id.trim();

    try {
      const formation = await Formation.findById(idToUpdate);
  
      if (!formation) {

        return res.status(404).json({ message: "formation not found" });
      }
      const ensg = await Ensg.findById(req.body.ensg);
      if (!ensg) {
        return res.status(404).json({ message: 'ensg not found' });
      }
      const categorie = await Categorie.findById(req.body.categorieId);

      if (!categorie) {
        return res.status(404).json({ message: 'Categorie not found' });
      }
 
      const newData = {
        prix: req.body.prix|| formation.prix,
        nom: req.body.nom|| formation.nom,
        description: req.body.description|| formation.description,
        ensg: req.body.ensg|| formation.ensg,
        categorie:categorie._id

    
      };
      const eleve = await Eleve.find();
      eleve.forEach( async (element) => {
        
   
        element.inscription.forEach(function callback(value, index) {
          console.log("2")
          if(value._id==req.params.id.trim()){
            element.inscription.splice(index, 1);
          element.inscription.push(formation);
           
          }
        });
        element.favorite.forEach(function callback(value, index) {
          if(value._id==req.params.id.trim()){
            element.favorite.splice(index, 1);
            element.favorite.push(formation);
          }
        });
        await element.save()
    
      });
      await formation.set(newData);
 

    await formation.save();
    res.json({ message: 'Formation modifié avec succès' });

    } catch (error) {
      res.status(500).json({ message: "Error updating formation", error: error.message });
    }
  });


/**
*  @desc Delete  formation 
*  @route PUT /api/formation/:id
*  @methode delete
*  @acces Private
*/
const deleteFormation = asyncHandler(async (req, res)=> {
  const formationId = req.params.id;

  try {
    const formation = await Formation.findById(formationId);

    if (!formation) {
      return res.status(404).json({ message: 'Formation non trouvée' });
    }

    const eleve = await Eleve.find();
    eleve.forEach(element => {
      

 
      element.inscription.forEach(function callback(value, index) {
        if(value._id==formationId){
        
          element.inscription.splice(index, 1);
      
        }
      });
      element.favorite.forEach(function callback(value, index) {
        if(value._id==formationId){
        
          element.favorite.splice(index, 1);

   
        }
      });
      element.save()
  
    });
    await formation.deleteOne();

    console.log('Formation supprimée avec succès');


    res.json({ message: 'Formation supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la formation :', error);
    res.status(500).json({ message: 'Une erreur est survenue lors de la suppression de la formation' });
  }



  
});

/** 
*  @desc Get formation by id
*  @route PUT /api/formation/:id
*  @methode PUT
*  @acces Private
*/
const getFourmationById= asyncHandler( async (req,res) => {
    const formation = await Formation.findById(   req.params.id.trim()).populate('ensg');
    const cours = await Cours.find({ formation: formation._id });
    formation.cours = cours;
    if(formation) {
     res.status(200).json(formation)
    }else{
         res.status(404);
         throw new Error('formation not found')
    }
  });
/**
 * @desc add cours
 *  @route POST /api/foramtion/:id
 *  @methode POST
 *  @acces private
 */
  
async function ajouterCoursAFormation(req, res) {
  const formationId = req.body.formationId;
  const { nomCours, descriptionCours,url } = req.body; 
  try {
    const formation = await Formation.findById(formationId);

    if (!formation) {
      return res.status(404).json({ message: 'Formation non trouvée' });
    }

    formation.cours.push({ titre: nomCours, description: descriptionCours ,url:url });
    await formation.save();

    const io = req.app.get('io'); 
    const admin = await User.find();

 
    admin.forEach(async (element) => {
      const notification = { text:req.ensg?.nom+'a ajouter un cours a la formation'+formation.nom }; 
     const index =element.notifications.push(notification);
     await element.save().then(() => {
      io.emit('addCours', element.notifications[index-1]); 
      console.log('Notification saved and emitted.'); 
    });

    });
    const eleve = await Eleve.find();

    eleve.forEach( async (element) => {
      
 
 
      element.inscription.forEach(function callback(value, index) {
      
        if(value._id==formationId){
          element.inscription.splice(index, 1);
        element.inscription.push(formation);
    
         
        }
      });
      element.favorite.forEach(function callback(value, index) {
        if(value._id==formationId){
          element.favorite.splice(index, 1);
          element.favorite.push(formation);


            
   
        }
      });
      await element.save()
  
    });
    res.json({ message: 'Nouveau cours ajouté à la formation avec succès', formation, });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Une erreur est survenue lors de l\'ajout du cours à la formation' });
  }
}
/** 
*  @desc Delete  cours 
*  @route PUT /api/formation/:id/:coursId
*  @methode delete
*  @acces Private
*/
async function supprimerCoursDeFormation(req, res) {

  const formationId = req.params.id; 
  const coursId = req.params.coursId;

  try {
    const formation = await Formation.findById(formationId);

    if (!formation) {
      return res.status(404).json({ message: 'Formation non trouvée' });
    }

    const indexCours = formation.cours.find(cours => cours._id.equals(coursId));
    if (indexCours === -1) {
      return res.status(404).json({ message: 'Cours non trouvé dans la formation' });
    }

    formation.cours.splice(indexCours, 1);

    await formation.save();
    const eleve = await Eleve.find();

    eleve.forEach( async (element) => {
      
 
 
      element.inscription.forEach(function callback(value, index) {
      
        if(value._id==formationId){
          element.inscription.splice(index, 1);
        element.inscription.push(formation);
    
         
        }
      });
      element.favorite.forEach(function callback(value, index) {
        if(value._id==formationId){
          element.favorite.splice(index, 1);
          element.favorite.push(formation);


            
   
        }
      });
      await element.save()
  
    });
    res.json({ message: 'Cours supprimé de la formation avec succès', formation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Une erreur est survenue lors de la suppression du cours de la formation' });
  }
}

/**
*  @desc Update  cours 
*  @route PUT /api/formations/:id/:coursId
*  @methode PUT
*  @acces Private
*/
async function updateCoursDeFormation(req, res) {
  const formationId = req.params.id; 
  const coursId = req.params.coursId;

  try {
    const formation = await Formation.findById(formationId);

    if (!formation) {
      return res.status(404).json({ message: 'Formation non trouvée' });
    }

    const indexCours = formation.cours.find(cours => cours._id.equals(coursId));
    if (indexCours === -1) {
      return res.status(404).json({ message: 'Cours non trouvé dans la formation' });
    }
    indexCours.url=req.body.url||  indexCours.url,
    indexCours.titre=req.body.titre|| indexCours.titre,
    indexCours.description=req.body.description||  indexCours.description,

    await formation.save();
    const eleve = await Eleve.find();

    eleve.forEach( async (element) => {
      
 
 
      element.inscription.forEach(function callback(value, index) {
      
        if(value._id==formationId){
          element.inscription.splice(index, 1);
        element.inscription.push(formation);
    
         
        }
      });
      element.favorite.forEach(function callback(value, index) {
        if(value._id==formationId){
          element.favorite.splice(index, 1);
          element.favorite.push(formation);


            
   
        }
      });
      await element.save()
  
    });
    res.json({ message: 'Cours update de la formation avec succès', formation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Une erreur est survenue lors de la modification du cours de la formation' });
  }
}
/** 
*  @desc Get cours by id
*  @route PUT /api/formation/:id/:coursId
*  @methode PUT
*  @acces Private
*/
async function getCoursDeFormationById(req, res) {
  const formationId = req.params.id; 
  const coursId = req.params.coursId;

  try {
    const formation = await Formation.findById(formationId);

    if (!formation) {
      return res.status(404).json({ message: 'Formation non trouvée' });
    }

    const indexCours = formation.cours.find(cours => cours._id.equals(coursId));
    if (indexCours === -1) {
      return res.status(404).json({ message: 'Cours non trouvé dans la formation' });
    }


    res.json({ indexCours });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Une erreur est survenue ' });
  }
}
/** 
*  @desc Get eleve inscrit a une formation
*  @route PUT /api/formation//eleves/:id
*  @methode GET
*  @acces Public
*/

async function getEleveInscritFormationById(req, res) {
  const formationId = req.params.id; 
  Inscription.find({ formation: formationId })
  .populate('eleve') 
  .exec()
  .then((inscriptions) => {
    if (inscriptions.length === 0) {
      console.log('Aucun élève inscrit à cette formation.');
    } else {
      console.log('Élèves inscrits à la formation :');
      inscriptions.forEach((inscription) => {
        return res.status(404).json(inscription);

      });
    }
  })
  .catch((error) => {
    console.error('Erreur lors de la recherche des inscriptions :', error);
    // Gérer l'erreur ici
  });
  
}


/** 
*  @desc Ajouter Commentaire au cours
*  @route  /api/cours//:formationId/:coursId
*  @methode Post
*  @acces Private
*/

 const ajouterCommentaireAuCours = async (req, res) => {
  const { formationId, coursId } = req.params;
  const { texte, auteur } = req.body;
  const ensg=req.ensg
  const eleve=req.eleve
  try {
    const formation = await Formation.findById(formationId);
    if (!formation) {
      return res.status(404).json({ message: 'Formation introuvable' });
    }

    const cours = formation.cours.id(coursId);
    if (!cours) {
      return res.status(404).json({ message: 'Cours introuvable' });
    }

 
    cours.commentaires.unshift({ texte,ensg,eleve }); 
    await formation.save();

    return res.status(201).json(cours);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Une erreur est survenue lors de l\'ajout du commentaire' });
  }
};


/** 
*  @desc Supprimer Commentaire au cours
*  @route  /api/cours/:formationId/:coursId/:commentaireId
*  @methode DELTE
*  @acces Private
*/

async function supprimerCommentaireAuCours(req, res) {
  const { formationId, coursId,commentaireId } = req.params;


  try {
    const formation = await Formation.findById(formationId);
    if (!formation) {
      return res.status(404).json({ message: 'Formation introuvable' });
    }

    const cours = formation.cours.id(coursId);
    if (!cours) {
      return res.status(404).json({ message: 'Cours introuvable' });
    }


    const indexCommentaire = cours.commentaires.find(commentaires => commentaires._id.equals(commentaireId));
    console.log(indexCommentaire)

    if (!indexCommentaire) {
      return res.status(404).json({ message: 'Commentaire non trouvé dans le cours' });
    }
    
    if(indexCommentaire.eleve!=null && req.ensg !=null ){
      return res.status(404).json({ message: 'Not authorized, invalid token' });
    }
    if(indexCommentaire.ensg!=null && req.eleve !=null ){
      return res.status(404).json({ message: 'Not authorized, invalid token' });
    }

    cours.commentaires.splice(indexCommentaire, 1);

    await formation.save();

    res.json({ message: 'Commentaire supprimé de cours avec succès', formation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Une erreur est survenue lors de la suppression du cours de la formation' });
  }
}

/** 
*  @desc Modifier Commentaire au cours
*  @route  /api/cours/:formationId/:coursId/:commentaireId
*  @methode PUT
*  @acces Private
*/


async function modifierCommentaireAuCours(req, res) {
  const { formationId, coursId,commentaireId } = req.params;


  try {
    const formation = await Formation.findById(formationId);
    if (!formation) {
      return res.status(404).json({ message: 'Formation introuvable' });
    }

    const cours = formation.cours.id(coursId);
    if (!cours) {
      return res.status(404).json({ message: 'Cours introuvable' });
    }


    const indexCommentaire = cours.commentaires.find(commentaires => commentaires._id.equals(commentaireId));
    console.log(indexCommentaire)

    if (!indexCommentaire) {
      return res.status(404).json({ message: 'Commentaire non trouvé dans le cours' });
    }
    if(indexCommentaire.eleve!=null && req.ensg !=null ){
      return res.status(404).json({ message: 'Not authorized, invalid token' });
    }
    if(indexCommentaire.ensg!=null && req.eleve !=null ){
      return res.status(404).json({ message: 'Not authorized, invalid token' });
    }
    indexCommentaire.texte=req.body.texte||  indexCommentaire.texte,


    await formation.save();

    res.json({ message: 'Commentaire modifié de cours avec succès', formation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Une erreur est survenue lors de la suppression du cours de la formation' });
  }
}

/** 
*  @desc Ajouter ressource au cours
*  @route  /api/cours/:formationId/:coursId
*  @methode Post
*  @acces Private
*/
let dossier=""
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'backend/uploads/'+dossier); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); 
  }
});

const upload = multer({ storage });


const ajouterRessourcesAuCours = async (req, res) => {
  const { formationId, coursId } = req.params;
  // const { titre } = req.body;

  try {
    const formation = await Formation.findById(formationId);
    if (!formation) {
      return res.status(404).json({ message: 'Formation introuvable' });
    }

    const cours = formation.cours.id(coursId);
    if (!cours) {
      return res.status(404).json({ message: 'Cours introuvable' });
    }
    dossier="Ressources"
    upload.single('file')(req, res, async (err) => {
      if (err) {
        console.log(err)
        return res.status(500).json({ error: 'Erreur lors du téléversement du fichier' });
      }
 
      const url = req.file ? req.file.filename : null;
      const titre=req.body.titre;
      console.log(req.file)
    cours.ressources.unshift({ titre,url }); 
    await formation.save();

    return res.status(201).json(cours); });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Une erreur est survenue lors de l\'ajout du ressources' });
  } 
};

/** 
*  @desc Supprimer ressources
*  @route  /api/formation/formationId/upload/:fileName
*  @methode DELETE
*  @acces Private
*/
const supprimerRessources =async (req, res) => {
  const filePath = 'backend/uploads/Ressources/' + req.body.fileName;
  const { formationId,coursId,ressourceId } = req.params;
  console.log(req.body.fileName)
  try {
    const formation = await Formation.findById(formationId);
    if (!formation) {
      return res.status(404).json({ message: 'Formation introuvable' });
    }
    const cours = formation.cours.id(coursId);
    if (!cours) {
      return res.status(404).json({ message: 'Cours introuvable' });
    }
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Fichier non trouvé' });
    }


    const indexCommentaire = cours.ressources.find(ressourcesSchema => ressourcesSchema._id.equals(ressourceId));


    if (!indexCommentaire) {
      return res.status(404).json({ message: 'Ressoource non trouvé dans le cours' });
    }
    
  

    cours.ressources.splice(indexCommentaire, 1);
    fs.unlinkSync(filePath);
    await formation.save();

    res.json({ message: 'Fichier supprimé avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Une erreur est survenue lors de la suppression du mini projet' });
  }


 
};



/** 
*  @desc Ajouter Mini Projet
*  @route  /api/formation/formation/upload
*  @methode POST
*  @acces Private
*/
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'backend/uploads/MiniProjets'); 
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + '-' + file.originalname); 
//   }
// });

// const upload = multer({ storage });


const ajouterMiniProjet = async (req, res) => {
  const { formationId } = req.params;
  const eleve = req.eleve;

  try {
    const formation = await Formation.findById(formationId);
    if (!formation) {
      return res.status(404).json({ message: 'Formation introuvable' });
    }
    dossier="MiniProjets"
    upload.single('file')(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ error: 'Erreur lors du téléversement du fichier' });
      }

      const url = req.file ? req.file.filename : null;
      const  titre  = req.body.titre;

      formation.miniProjets.unshift({ titre, eleve, url });
      await formation.save();

      return res.status(201).json(formation);
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Une erreur est survenue lors de l\'ajout du mini projet' });
  }
};


/** 
*  @desc Supprimer Mini Projet
*  @route  /api/formation/formation/upload/:fileName
*  @methode DELETE
*  @acces Private
*/
const supprimerFichier =async (req, res) => {
  const filePath = 'backend/uploads/MiniProjets/' + req.body.fileName;
  const { formationId,miniProjetId } = req.params;
  const eleve = req.eleve;

  try {
    const formation = await Formation.findById(formationId);
    if (!formation) {
      return res.status(404).json({ message: 'Formation introuvable' });
    }
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Fichier non trouvé' });
    }


    const indexCommentaire = formation.miniProjets.find(miniProjetSchema => miniProjetSchema._id.equals(miniProjetId));


    if (!indexCommentaire) {
      return res.status(404).json({ message: 'Commentaire non trouvé dans le cours' });
    }
    
  

    formation.miniProjets.splice(indexCommentaire, 1);
    fs.unlinkSync(filePath);
    await formation.save();

    res.json({ message: 'Fichier supprimé avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Une erreur est survenue lors de la suppression du mini projet' });
  }


 
};



/** 
*  @desc Crration des quiz et ajout des questions
*  @route  /api/cours/:formationId/:coursId/
*  @methode Post
*  @acces Private
*/

const creeQuizAuCours = async (req, res) => {
  const { formationId, coursId } = req.params;
  
  const { question, reponses, note } = req.body;

  try {
    const formation = await Formation.findById(formationId);
    if (!formation) {
      return res.status(404).json({ message: 'Formation introuvable' });
    }

    const cours = formation.cours.id(coursId);
    if (!cours) {
      return res.status(404).json({ message: 'Cours introuvable' });
    }

    const newQuestion = {
      question: question,
      reponses: reponses.map(reponse => ({ reponse: reponse.reponse, correct: reponse.correct })), // Assuming all reponses are incorrect by default
    };

    cours.quiz.note = note;
    cours.quiz.questions.unshift(newQuestion);
    
    await formation.save();
    const eleve = await Eleve.find();

    eleve.forEach( async (element) => {
      
 
 
      element.inscription.forEach(function callback(value, index) {
      
        if(value._id==formationId){
          element.inscription.splice(index, 1);
        element.inscription.push(formation);
    
         
        }
      });
      element.favorite.forEach(function callback(value, index) {
        if(value._id==formationId){
          element.favorite.splice(index, 1);
          element.favorite.push(formation);


            
   
        }
      });
      await element.save()
  
    });
    return res.status(201).json(cours);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Une erreur est survenue lors de l\'ajout du quiz' });
  }
};
/** 
*  @desc Modifier Question  du quiz et modification des reponse les reponses lezm ytb3tho lkol ara o5ra ka liste b3d ma tsir modification
*  @route  /api/cours/:formationId/:coursId/:questionId
*  @methode PUT
*  @acces Private
*/


const modifierQuestionQuizduCours = async (req, res) => {
  const { formationId, coursId, questionId } = req.params;

  const { question, reponses, note } = req.body;

  try {
    const formation = await Formation.findById(formationId);
    if (!formation) {
      return res.status(404).json({ message: 'Formation introuvable' });
    }

    const cours = formation.cours.id(coursId);
    if (!cours) {
      return res.status(404).json({ message: 'Cours introuvable' });
    }

    const quizQuestion = cours.quiz.questions.id(questionId);
    if (!quizQuestion) {
      return res.status(404).json({ message: 'Question de quiz introuvable' });
    }


    quizQuestion.question = question;
    quizQuestion.reponses = reponses.map(reponse => ({ reponse: reponse.reponse, correct: reponse.correct })); // Assuming all reponses are incorrect by default

    cours.quiz.note = note;

    await formation.save();
    const eleve = await Eleve.find();

    eleve.forEach( async (element) => {
      
 
 
      element.inscription.forEach(function callback(value, index) {
      
        if(value._id==formationId){
          element.inscription.splice(index, 1);
        element.inscription.push(formation);
    
         
        }
      });
      element.favorite.forEach(function callback(value, index) {
        if(value._id==formationId){
          element.favorite.splice(index, 1);
          element.favorite.push(formation);


            
   
        }
      });
      await element.save()
  
    });
    return res.status(200).json(cours);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Une erreur est survenue lors de la modification du quiz' });
  }
};


/** 
*  @desc Supprimer question de quiz
*  @route  /api/cours/:formationId/:coursId/:questionId
*  @methode DELTE
*  @acces Private
*/

async function supprimerQuestionduQuiz(req, res) {
  const { formationId, coursId,questionId } = req.params;


  try {
    const formation = await Formation.findById(formationId);
    if (!formation) {
      return res.status(404).json({ message: 'Formation introuvable' });
    }

    const cours = formation.cours.id(coursId);
    if (!cours) {
      return res.status(404).json({ message: 'Cours introuvable' });
    }


    const indexCommentaire = cours.quiz.questions.find(quiz => quiz._id.equals(questionId));


    if (!indexCommentaire) {
      return res.status(404).json({ message: 'question non trouvé dans le quiz' });
    }
    
  

    cours.quiz.questions.splice(indexCommentaire, 1);

    await formation.save();
    const eleve = await Eleve.find();

    eleve.forEach( async (element) => {
      
 
 
      element.inscription.forEach(function callback(value, index) {
      
        if(value._id==formationId){
          element.inscription.splice(index, 1);
        element.inscription.push(formation);
    
         
        }
      });
      element.favorite.forEach(function callback(value, index) {
        if(value._id==formationId){
          element.favorite.splice(index, 1);
          element.favorite.push(formation);


            
   
        }
      });
      await element.save()
  
    });
    res.json({ message: 'question supprimé de quiz avec succès', formation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Une erreur est survenue lors de la suppression du quiz de la formation' });
  }
}
/** 
*  @desc Ajouter exercie aux cours
*  @route  /api/cours/exercices/:formationId/:coursId/
*  @methode Post
*  @acces Private
*/

const ajouterExerciceAuCours = async (req, res) => {
  const { formationId, coursId } = req.params;
  
  const { exercice} = req.body;

  try {
    const formation = await Formation.findById(formationId);
    if (!formation) {
      return res.status(404).json({ message: 'Formation introuvable' });
    }

    const cours = formation.cours.id(coursId);
    if (!cours) {
      return res.status(404).json({ message: 'Cours introuvable' });
    }

  

    cours.exercice = exercice;
    
    await formation.save();
    const eleve = await Eleve.find();

    eleve.forEach( async (element) => {
      
 
 
      element.inscription.forEach(function callback(value, index) {
      
        if(value._id==formationId){
          element.inscription.splice(index, 1);
        element.inscription.push(formation);
    
         
        }
      });
      element.favorite.forEach(function callback(value, index) {
        if(value._id==formationId){
          element.favorite.splice(index, 1);
          element.favorite.push(formation);


            
   
        }
      });
      await element.save()
  
    });
    return res.status(201).json(cours);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Une erreur est survenue lors de l\'ajout de l\'exrcice' });
  }
};
/** 
*  @desc delete exercie aux cours
*  @route  /api/cours/:formationId/:coursId/
*  @methode Delete
*  @acces Private
*/

const deleteExerciceAuCours = async (req, res) => {
  const { formationId, coursId } = req.params;
  

  try {
    const formation = await Formation.findById(formationId);
    if (!formation) {
      return res.status(404).json({ message: 'Formation introuvable' });
    }

    const cours = formation.cours.id(coursId);
    if (!cours) {
      return res.status(404).json({ message: 'Cours introuvable' });
    }

  

    cours.exercice = null;
    
    await formation.save();
    const eleve = await Eleve.find();

    eleve.forEach( async (element) => {
      
 
 
      element.inscription.forEach(function callback(value, index) {
      
        if(value._id==formationId){
          element.inscription.splice(index, 1);
        element.inscription.push(formation);
    
         
        }
      });
      element.favorite.forEach(function callback(value, index) {
        if(value._id==formationId){
          element.favorite.splice(index, 1);
          element.favorite.push(formation);


            
   
        }
      });
      await element.save()
  
    });
    return res.status(201).json(cours);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Une erreur est survenue lors de l\'suppression de l\'exrcice' });
  }
};




export{
    deleteExerciceAuCours,
    ajouterExerciceAuCours,
    supprimerQuestionduQuiz,
    modifierQuestionQuizduCours,
    supprimerFichier,
    ajouterMiniProjet,
    modifierCommentaireAuCours,
    ajouterCommentaireAuCours,
    supprimerCommentaireAuCours,
    getEleveInscritFormationById,
    supprimerCoursDeFormation,
    ajouterCoursAFormation,
    updateCoursDeFormation,
    getCoursDeFormationById,
    addFormation,
    getformation,
    updateFormation,
    deleteFormation,
    getFourmationById,
    creeQuizAuCours,
    ajouterRessourcesAuCours,
    supprimerRessources
}