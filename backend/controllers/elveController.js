import asyncHandler from "express-async-handler"
import Eleve from '../models/eleveModel.js'
import generateToken   from "../utils/generateToken.js";
import Formation from "../models/formationModel.js";
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

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
    const {nom , email , password,numtel,age,prenom,nvEtude}=req.body;
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
        age,
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
      html: `Click the following link to verify your email: 
      <a href=http://localhost:3000/confirm/${activationCode}> Cliquer ici</a>`
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
          subject: 'Hello '+ nom +' from Future visions with SMTP',
          html: `Nouveaux password  ${resetPassword}`
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

const updateUserProfile= asyncHandler( async (req,res) => {
    const eleve = await Eleve.findById(req.eleve._id);
    if(eleve) {
        eleve.nom = req.body.nom || eleve.nom;
        eleve.email = req.body.email || eleve.email;
        eleve.prenom = req.body.prenom || eleve.prenom;
        eleve.age = req.body.age || eleve.age;
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
    }
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
    addFavoriteFormation
    

}