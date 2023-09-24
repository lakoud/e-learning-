import asyncHandler from "express-async-handler"
import Eleve from '../models/eleveModel.js'
import generateToken   from "../utils/generateToken.js";
import Formation from "../models/formationModel.js";
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import fs from 'fs';
import Ensg from "../models/ensgModel.js";
/**
 * @desc Auth user/set token
 *  @route POST /api/eleve/auth
 *  @methode POST
 *  @acces public
 */

const authUser= asyncHandler( async (req,res) => {
    const {email,password}=req.body;
    const eleve= await Eleve.findOne({email})
    
    if(eleve && (await eleve.matchPassword(password))){
        generateToken(res,eleve._id)
        res.status(201).json({
            _id:eleve._id,
            name:eleve.nam,
            email:eleve.email
        });

    }else{
        res.status(401);
        throw new Error('Invalid email or password')
    }
});
/**
 * @desc Register a new  eleve
 *  @route POST /api/eleve
 *  @methode POST
 *  @acces public
 */

const registerUser= asyncHandler( async (req,res) => {
    let {nom , email , password,numtel,datedenaissance,prenom,nvEtude}=req.body;
    const userExists= await Eleve.findOne({email});

    if(userExists){
        res.status(400);
        throw new Error('eleve already exists');

    }
    const caracteres="123456789abcdefghijklmnlopsqxwrtyu";
    let activationCode=""
    for (let i = 0; i <25; i++) {
      activationCode+=caracteres[Math.floor(Math.random()*caracteres.length)]
      
    }
    const eleve = await Eleve.create({
        nom,
        email,
        password,
        numtel,
        datedenaissance,
        prenom,
        nvEtude,
        activationCode

    })
    if(eleve){
    
        generateToken(res,eleve._id)

        try {
          const transporter = nodemailer.createTransport({
            host: 'mail.futurevisions.tn',
            port: 465,
            secure: true, 
            auth: {
              user: 'lucc@futurevisions.tn',
              pass: '!W^zR1CBcQ6!'
            }
          });
      
          const mailOptions = {
            from: 'lucc@futurevisions.tn',
      to: email,
      subject: 'Hello '+ nom +' from Future visions with SMTP',
      html: `<head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Vérification de votre compte</title>
      <style>
          /* Ajoutez vos styles CSS en ligne ici */
          body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
          }
          .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #ffffff;
              box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
          }
          h1 {
              color: #333;
          }
          p {
              color: #555;
          }
          a {
              color: #007BFF;
              text-decoration: none;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <h1>Vérification de votre compte</h1>
          <p>Merci de vous être inscrit sur notre site. Pour activer votre compte, veuillez cliquer sur le lien de vérification ci-dessous :</p>
          <p>   <a href=http://localhost:3000/confirm/${activationCode}>Vérifier mon compte</a></p>
          <p>Si vous n'avez pas créé de compte sur notre site, vous pouvez ignorer cet email en toute sécurité.</p>
      </div>
  </body>
    `
    };
      
          const info = await transporter.sendMail(mailOptions);
          console.log('Email sent:', info.response);
      
          res.status(200).json({ message: 'Email sent successfully' });
        } catch (error) {
          console.error('Error:', error);
          res.status(500).json({ error: 'An error occurred while sending the email' });
        }
    }else{
        res.status(400);
        throw new Error('Invalid eleve data')
    }
   
    res.status(200).json({message:'Register eleve'})
});
/**
 * @desc Verifier email 
 *  @route POST /api/eleve/:activationCode
 *  @methode POST
 *  @acces public
 */

const verifyUser = asyncHandler(async (req, res) => {
  try {
      const eleve = await Eleve.findOne({ activationCode: req.params.activationCode });

      if (!eleve) {
          return res.status(400).json({
              message: "Ce code d'activation est faux.",
          });
      }
      if(eleve.isActive==true){ 
        return res.status(400).json({
          message: "Déja activé.",
      });
      }
      eleve.isActive = true;
      await eleve.save();

      return res.status(200).json({ message: 'Eleve registered.' });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error.' });
  }
});

/**
 * @desc ResetPassword
 *  @route POST /api/eleve/resetPassword
 *  @methode POST
 *  @acces public
 */
const resetPassword= asyncHandler( async (req,res) => {
  const {nom , email }=req.body;
  const userExists= await Eleve.findOne({email});

  if(!userExists){
      res.status(400);
      throw new Error('email not found');

  }
  const caracteres="123456789abcdefghijklmnlopsqxwrtyu";
  let resetPassword=""
  for (let i = 0; i <6; i++) {
    resetPassword+=caracteres[Math.floor(Math.random()*caracteres.length)]
    
  }
      try {
        const transporter = nodemailer.createTransport({
          host: 'mail.futurevisions.tn',
          port: 465,
          secure: true, 
          auth: {
            user: 'lucc@futurevisions.tn',
            pass: '!W^zR1CBcQ6!'
          }
        });
    
        const mailOptions = {
          from: 'lucc@futurevisions.tn',
          to: email,
          subject: 'Hello '+ nom +' from Future visions ',
          html: `<head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Réinitialisation de votre mot de passe</title>
          <style>
              /* Ajoutez vos styles CSS en ligne ici */
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  margin: 0;
                  padding: 0;
              }
              .container {
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  background-color: #ffffff;
                  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
              }
              h1 {
                  color: #333;
              }
              p {
                  color: #555;
              }
              .pass{
                  border:1px solid   #007BFF;
                  border-raduis:15px;
                  padding:5px;
                  width:50%;
                  text-align:center;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <h1>Réinitialisation de votre mot de passe</h1>
              <p>Vous avez demandé à réinitialiser votre mot de passe. Voici votre code de réinitialisation :</p>
              <p style="font-size: 24px; font-weight: bold; color: #007BFF;"class="pass"> ${resetPassword}</p>
              <p>Utilisez ce code pour réinitialiser votre mot de passe sur notre site.</p>
              <p>Si vous n'avez pas fait cette demande, vous pouvez ignorer cet email en toute sécurité. Votre mot de passe restera inchangé.</p>
          </div>
      </body>`
  };
    
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
        userExists.resetPassword=resetPassword;
        userExists.save()
        res.status(200).json({ message: userExists});
      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while sending the email' });
      }
 
});
   /**
* @desc ajoot code pour modifier mot de passe
*  @route POST /api/eleve/writePassword
*  @methode POST
*  @acces public
*/
const writeNewPassword= asyncHandler( async (req,res,next)=> { 
  const { resetPassword, email, }=req.body;
  const userExists= await Eleve.findOne({email});
  if(!userExists){  
    res.status(500).json({ error: 'User not found' });

   }

    if(userExists && (await userExists.matchRestPassword(resetPassword))){
      generateToken(res,userExists._id)
      res.status(201).json({
          _id:userExists._id,
          name:userExists.nam,
          email:userExists.email
      });
  }
  
 res.send("Code incorrect")
 } );

 /**
* @desc modificaion de password
*  @route POST /api/eleve/modifierPassword
*  @methode POST
*  @acces public
*/

const modifyPassword= asyncHandler( async (req,res) => {
  const {  email , password}=req.body;
  const userExists= await Eleve.findOne({email});

  if(!userExists){
      res.status(400);
      throw new Error('user not found');

  }

  if(userExists){
      try {
        console.log(password)
          userExists.password=password;

          userExists.resetPassword=null;
                  generateToken(res,userExists._id)
                  res.status(201).json({
                      _id:userExists._id,
                      name:userExists.nam,
                      email:userExists.email
                  });
                  userExists.save();
                  console.log(userExists.password)
      } catch (error) {
          console.log(error)
      }

  }else{
      res.status(400);
      throw new Error('Invalid user data')
  }
 
  res.status(200).json({message:'done'})
});
/**
 * @desc Logout   eleve
 *  @route  /api/eleve
 *  @methode POST
 *  @acces public
 */

const logoutUser= asyncHandler( async (req,res) => {
   res.cookie('jwt','',{
    httpOnly:true,
    expires:new Date(0),
   });
   res.status(200).json({message:'eleve logged out'})
});

/**
 * @desc  Get  eleve profile
 *  @route  /api/eleve/profile
 *  @methode GET
 *  @acces Private
 */

const getUserProfile= asyncHandler( async (req,res) => {

    const eleve = {
        _id:req.eleve._id,
        nom:req.eleve.nom,
        prenom:req.eleve.prenom,
        email:req.eleve.email,
        datedenaissance:req.eleve.datedenaissance,
        inscription:req.eleve.inscription,
        favorite:req.eleve.favorite,
    }
    res.status(200).json(eleve)
});

/**
 * @desc Update eleve profile
 *  @route PUT /api/eleve/profile
 *  @methode PUT
 *  @acces Private
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'backend/uploads/photoeleves'); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); 
  }
});

const upload = multer({ storage });
const updateUserProfile= asyncHandler( async (req,res) => {
    const eleve = await Eleve.findById(req.eleve._id);
   upload.single('file')(req, res, async (err) => {
      if (err) {
        console.log(err)
        return res.status(500).json({ error: 'Erreur lors du téléversement du fichier' });
      }

      const url = req.file ? req.file.filename : null;

    if(eleve) {
       eleve.photo = url;
       eleve.genre = req.body.genre || eleve.genre;
        eleve.nom = req.body.nom || eleve.nom;
        eleve.email = req.body.email || eleve.email;
        eleve.prenom = req.body.prenom || eleve.prenom;
        eleve.datedenaissance = req.body.datedenaissance || eleve.datedenaissance;
        eleve.numtel = req.body.numtel || eleve.numtel;
        eleve.nvEtude = req.body.nvEtude || eleve.nvEtude;

      
      
     if(req.body.password) { 
        eleve.password = req.body.password;
  
     }
     const updatedEnsg=await eleve.save();
     res.status(200).json({
         _id:updatedEnsg._id,
         nom:updatedEnsg.nom,
         email:updatedEnsg.email,
     }
  
     )
    }else{
         res.status(404);
         throw new Error('User not found')
    }    });
  });


/**
 * @desc  Get   All EeLve
 *  @route  /api/eleve/
 *  @methode GET
 *  @acces Public
 */

const getAllEleves= asyncHandler( async (req,res) => {

  const eleve = await Eleve.find().select("-password -favorite");

    res.status(200).json(eleve)});

/**
 * @desc get eleve BY ID
 *  @route  /api/eleve/:id
 *  @methode get
 *  @acces Public
 */
const getEleveById= asyncHandler( async (req,res) => {
  const eleve = await Eleve.findById(req.params.id.trim());
  console.log(req.params)
 console.log(eleve)
  res.status(200).json(eleve)});
/**
 * @desc get eleve BY ID
 *  @route  /api/eleve/:id
 *  @methode get
 *  @acces Public
 */
const deleteEleve= asyncHandler( async (req, res) => {
  const idToDelete = req.params.id;
  try {
    const eleve = await Eleve.findById(idToDelete);

    if (!eleve) {
      return res.status(404).json({ message: "Eleve not found" });
    }

    await Eleve.deleteOne({ _id: idToDelete });

    res.status(200).json({ message: "Eleve has been deleted" });
    
  } catch (error) {
    res.status(500).json({ message: "Error deleting info", error: error.message });
  }
});
/**
 * @desc Add favorite
 *  @route PUT /api/eleve/favorite
 *  @methode PUT
 *  @acces Private
 */

const addFavoriteFormation = asyncHandler(async (req, res) => {
    const eleve = await Eleve.findById(req.eleve._id);
    if (eleve) {
      const formationId = req.body.favorite;
  
      const formation = await Formation.findById(formationId);
      if (!formation) {
        return res.status(404).json({ message: 'Formation not found' });
      }
      const indexCours = eleve.favorite.find(favorite => favorite._id.equals(formationId));
      console.log(indexCours)
      if (indexCours ==null) {
        
        eleve.favorite.push(formation);
        console.log('Formation added to favorites');
      } else {

    
        eleve.favorite.splice(indexCours, 1);
        console.log('Formation removed from favorites');
      }
     
      const updatedEleve = await eleve.save();
      res.status(200).json({
        _id: updatedEleve._id,
        nom: updatedEleve.nom,
        email: updatedEleve.email,
        favorite: updatedEleve.favorite, 
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  });


/**
 * @desc Inscription
 *  @route  /api/eleve/inscription
 *  @methode Post
 *  @acces Private
 */


  const nouvelleInscription  = asyncHandler(async (req, res) => {
    const eleve = await Eleve.findById(req.eleve._id);
    if (eleve) {
      const formationId = req.body.inscription;
  
      const formation = await Formation.findById(formationId);
      if (!formation) {
        return res.status(404).json({ message: 'Formation not found' });
      }
      const indexCours = eleve.inscription.find(inscription => inscription._id.equals(formationId));
      console.log(indexCours)
      if (indexCours ==null) {
        
        eleve.inscription.push(formation);
        console.log('Formation added to list inscription');
      } 
      // else {
    
      //   eleve.inscription = eleve.inscription.filter((id) => id !== formationId);
      //   console.log('Formation removed from favorites');
      // }
  
      const updatedEleve = await eleve.save();
      res.status(200).json({
        _id: updatedEleve._id,
        nom: updatedEleve.nom,
        email: updatedEleve.email,
        inscription: updatedEleve.inscription, 
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  });


/**
 * @desc Ajouter Note
 *  @route  /api/eleve/note/:formationId/:coursId
 *  @methode Post
 *  @acces Private
 */



  async function ajoutNoteQuiz(req, res) {
    const { formationId, coursId } = req.params;
    
   
    const eleve = await Eleve.findById(req.eleve._id);

      
    eleve.inscription.forEach(function callback(value, index) {
      
        if(value._id==formationId){

        value.cours.forEach(function callback(value, index) {
          if(value._id==coursId){   
            value.quiz.note="7"
            }
        
        });
        }
      });
 

  
       const updatedEleve=await eleve.save();
  
      res.status(500).json({ message:updatedEleve});

  }
  
  /** 
*  @desc demander RendezVous
*  @route  /api/eleves/rendezvous/:id
*  @methode POST
*  @acces Private
*/



const DemanderRendezVous = async (req, res) => {
  const { ensgId } = req.params;
  const eleve = req.eleve;
  const { date, description, accepter}=req.body;

  try {
    const ensg = await Ensg.findById(ensgId);
    if (!ensg) {
      return res.status(404).json({ message: 'ensg introuvable' });
    }
 

    ensg.rendezVous.unshift({ date, description, accepter ,eleve});
      await ensg.save();

      return res.status(201).json(ensg);
   
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Une erreur est survenue lors de l\'ajout du rendzevous' });
  }
};


export{
  modifyPassword,
  writeNewPassword,
  resetPassword,
  verifyUser,
  deleteEleve,
  ajoutNoteQuiz,
    nouvelleInscription,
    getEleveById,
    authUser,
    updateUserProfile,
    logoutUser,
    registerUser,
    getUserProfile,
    getAllEleves,
    addFavoriteFormation,
    DemanderRendezVous
    

}