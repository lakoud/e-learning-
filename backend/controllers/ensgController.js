import asyncHandler from "express-async-handler"
import Ensg from "../models/ensgModel.js";
import generateToken from "../utils/generateToken.js";
import Formation from "../models/formationModel.js";
import multer from 'multer';


/**
 * @desc add info
 *  @route POST /api/info
 *  @methode POST
 *  @acces private
 */

const addEnsg= asyncHandler( async (req,res) => {
    const {nom , prenom ,email,numtel,password}=req.body;
    const ensgExists= await Ensg.findOne({email});

    if(ensgExists){
        res.status(400);
        throw new Error('ensg email already exists');

    }
 
    const ensg = await Ensg.create({
        nom,
        prenom,
        email,
        numtel,
        password,
       
    })

    if(ensg){
    
        // generateToken(res,ensg._id)

    }else{
        res.status(400);
        throw new Error('Invalid info data')
    }
   
    res.status(200).json({message:'ensg adedd'})
});

/**
 * @desc  Get   All Ensg
 *  @route  /api/ensg/get
 *  @methode GET
 *  @acces Public
 */

const getEnsgs= asyncHandler( async (req,res) => {
    const ensg = await Ensg.find();
    for (const f of ensg) {
        const formation = await Formation.find({ ensg: f._id });
        f.formation = formation;
      }
    res.status(200).json(ensg)});



/**
 * @desc Auth ensg/set token
 *  @route POST /api/ensg/auth
 *  @methode POST
 *  @acces public
 */

const authEnsg= asyncHandler( async (req,res) => {
    const {email,password}=req.body;
    const ensg= await Ensg.findOne({email})

    if(ensg && (await ensg.matchPassword(password))){
        generateToken(res,ensg._id)
        res.status(201).json({
            _id:ensg._id,
            name:ensg.name,
            email:ensg.email
        });

    }else{
        res.status(401);
        throw new Error('Invalid email or password')
    }
});


/**
 * @desc get   ensg profile
 *  @route PUT /api/info/profileEnsg
 *  @methode PUT
 *  @acces Private
 */

const getEnsgProfile= asyncHandler( async (req,res) => {
    const ensg = {
        _id:req.ensg._id,
        name:req.ensg.name,
        email:req.ensg.email,
    }
    res.status(200).json(ensg)
});

/**
*  @desc Update  ensg  profile
*  @route PUT /api/ensg/profile
*  @methode PUT
*  @acces Private
*/
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'backend/uploads/photoensg'); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); 
  }
});

const upload = multer({ storage });

const updateEnsgProfile= asyncHandler( async (req,res) => {
  const ensg = await Ensg.findById(req.ensg._id);
  const ensgadmin = await Ensg.findById(req.params.id);
  upload.single('file')(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur lors du téléversement du fichier' });
    }

    const url = req.file ? req.file.filename : null;
      if(ensg || ensgadmin ) {
        ensg.genre= req.body.genre || ensg.genre;
        ensg.photo = url || ensg.photo;
        ensg.prenom = req.body.prenom || ensg.prenom;
        ensg.numtel = req.body.numtel || ensg.numtel;
        ensg.nom = req.body.nom || ensg.nom;
        ensg.email = req.body.email || ensg.email;
          if(req.body.password) { 
            ensg.password = req.body.password;

          }
        const updatedEnsg=await ensg.save();
        res.status(200).json({
            _id:updatedEnsg._id,
            nom:updatedEnsg.nom,
            email:updatedEnsg.email,
            prenom:updatedEnsg.prenom,

        }

       )
       }else{
          res.status(404);
          throw new Error('Ensg not found')
  }

});
});
/**
*  @desc Update  ensg  profile
*  @route PUT /api/ensg/profile
*  @methode PUT
*  @acces Private
*/

const updateEnsg= asyncHandler( async (req,res) => {
    const ensg = await Ensg.findById(req.params.id);

    if(ensg  ) {
      ensg.genre= req.body.genre || ensg.genre;
      ensg.nom = req.body.nom || ensg.nom;
     ensg.email = req.body.email || ensg.email;
     ensg.prenom = req.body.prenom || ensg.prenom;

     ensg.numtel = req.body.numtel || ensg.numtel;

   
     const updatedEnsg=await ensg.save();
     res.status(200).json({
         _id:updatedEnsg._id,
         name:updatedEnsg.name,
         email:updatedEnsg.email,
     }
  
     )
    }else{
         res.status(404);
         throw new Error('User not found')
    }
  });
  
/**
 * @desc Logout   ensg
 *  @route  /api/ensg
 *  @methode POST
 *  @acces public
 */

const logoutEnsg= asyncHandler( async (req,res) => {
    res.cookie('jwt','',{
     httpOnly:true,
     expires:new Date(0),
    });
    res.status(200).json({message:'user logged out'})
 });

 
/**
 * @desc Supprimer   ensg
 *  @route  /api/ensg/:id
 *  @methode Delete
 *  @acces private
 */

 const supprimerensg=asyncHandler( async (req, res) => {
    const idToDelete = req.params.id;
    try {
      const ensg = await Ensg.findById(idToDelete);
      if (!ensg) {
        return res.status(404).json({ message: "Ensg not found" });
      }
      await Ensg.deleteOne({ _id: idToDelete }); 
      res.status(200).json({ message: "Ensg has been deleted" });
      
    } catch (error) {
      res.status(500).json({ message: "Error deleting info", error: error.message });
    }
  })
/** 
*  @desc Delete  rendez vous 
*  @route PUT /api/ensg/rendezVous/:id
*  @methode delete
*  @acces Private
*/
async function supprimerRenderVous(req, res) {

  const rendezVousId = req.params.id; 
  const ensgId = req.ensg._id; 

  try {
    const ensg = await Ensg.findById(ensgId);

    if (!ensg) {
      return res.status(404).json({ message: 'Ensg non trouvée' });
    }

    const indexRendezVous = ensg.rendezVous.find(rendezVous => rendezVous._id.equals(rendezVousId));
    if (indexRendezVous === -1) {
      return res.status(404).json({ message: 'RendezVous non trouvé dans la formation' });
    }

    ensg.rendezVous.splice(indexRendezVous, 1);

    await ensg.save();

    res.json({ message: 'rendezVous supprimé de la formation avec succès', ensg });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Une erreur est survenue lors de la suppression du cours de la formation' });
  }
}

/** 
*  @desc accepter  rendez vous 
*  @route  /api/ensg/rendezVousAccepter/:id
*  @methode PUT
*  @acces Private
*/
async function accepterRenderVous(req, res) {

  const rendezVousId = req.params.id; 
  const ensgId = req.ensg?._id; 

  try {
    const ensg = await Ensg.findById(ensgId);

    if (!ensg) {
      return res.status(404).json({ message: 'Ensg non trouvée' });
    }

    const indexRendezVous = ensg.rendezVous.find(rendezVous => rendezVous._id.equals(rendezVousId));
    if (indexRendezVous === -1) {
      return res.status(404).json({ message: 'RendezVous non trouvé dans la formation' });
    }


    indexRendezVous.accepter=true;
    await ensg.save();

    res.json({ message: 'rendezVous supprimé de la formation avec succès', ensg });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Une erreur est survenue lors de la suppression du cours de la formation' });
  }
}

export{
    updateEnsg,
    addEnsg,
    getEnsgs,
    getEnsgProfile,
    authEnsg,
    updateEnsgProfile,
    logoutEnsg,
    supprimerensg,
    supprimerRenderVous,
    accepterRenderVous
}