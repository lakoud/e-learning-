import asyncHandler from "express-async-handler"
import Eleve from '../models/eleveModel.js'
import generateToken   from "../utils/generateToken.js";
import Formation from "../models/formationModel.js";
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import fs from 'fs';
import Parent from "../models/parentModel.js";
/**
 * @desc Auth user/set token
 *  @route POST /api/parent/auth
 *  @methode POST
 *  @acces public
 */

const authUser= asyncHandler( async (req,res) => {
    const {email,password}=req.body;
    const parent= await Parent.findOne({email})
    
    if(parent && (await parent.matchPassword(password))){
        generateToken(res,parent._id)
        res.status(201).json({
            _id:parent._id,
            name:parent.name,
            email:parent.email
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
    let {nom , email , password,numtel,prenom,genre}=req.body;
    const userExists= await Parent.findOne({email});

    if(userExists){
        res.status(400);
        throw new Error('eleve already exists');

    }
    const caracteres="123456789abcdefghijklmnlopsqxwrtyu";
    let activationCode=""
    for (let i = 0; i <25; i++) {
      activationCode+=caracteres[Math.floor(Math.random()*caracteres.length)]
      
    }
    const parent = await Parent.create({
        nom,
        email,
        password,
        numtel,
        prenom,
        activationCode,
        genre

    })
    if(parent){
    
        generateToken(res,parent._id)

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
        throw new Error('Invalid parent data')
    }
   
    res.status(200).json({message:'Register parent'})
});
/**
 * @desc Verifier email 
 *  @route POST /api/parent/:activationCode
 *  @methode POST
 *  @acces public
 */

const verifyUser = asyncHandler(async (req, res) => {
  try {
      const parent = await Parent.findOne({ activationCode: req.params.activationCode });

      if (!parent) {
          return res.status(400).json({
              message: "Ce code d'activation est faux.",
          });
      }
      if(parent.isActive==true){ 
        return res.status(400).json({
          message: "Déja activé.",
      });
      }
      parent.isActive = true;
      await parent.save();

      return res.status(200).json({ message: 'Parent registered.' });
  } catch (error) {
      return res.status(500).json({ message: 'Internal server error.' });
  }
});

/**
 * @desc ResetPassword
 *  @route POST /api/parent/resetPassword
 *  @methode POST
 *  @acces public
 */
const resetPassword= asyncHandler( async (req,res) => {
  const {nom , email }=req.body;
  const userExists= await Parent.findOne({email});

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
*  @route POST /api/parent/writePassword
*  @methode POST
*  @acces public
*/
const writeNewPassword= asyncHandler( async (req,res,next)=> { 
  const { resetPassword, email, }=req.body;
  const userExists= await Parent.findOne({email});
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
  const userExists= await Parent.findOne({email});

  if(!userExists){
      res.status(400);
      throw new Error('Parent not found');

  }

  if(userExists){
      try {
          userExists.password=password;

          userExists.resetPassword=null;
                  generateToken(res,userExists._id)
                  res.status(201).json({
                      _id:userExists._id,
                      name:userExists.nam,
                      email:userExists.email
                  });
                  userExists.save();
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
   res.status(200).json({message:'Parent logged out'})
});

/**
 * @desc  Get  parent profile
 *  @route  /api/eleve/profile
 *  @methode GET
 *  @acces Private
 */

const getUserProfile= asyncHandler( async (req,res) => {

    const parent = {
        _id:req.parent._id,
        nom:req.parent.nom,
        prenom:req.parent.prenom,
        email:req.parent.email,
        datedenaissance:req.parent.datedenaissance,
     
    }
    res.status(200).json(parent)
});

/**
 * @desc Update parent profile
 *  @route PUT /api/parent/profile
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
    const parent = await Parent.findById(req.parent._id);



    if(parent) {
        parent.nom = req.body.nom || parent.nom;
        parent.email = req.body.email || parent.email;
        parent.prenom = req.body.prenom || parent.prenom;
        parent.datedenaissance = req.body.datedenaissance || parent.datedenaissance;
        parent.numtel = req.body.numtel || parent.numtel;

      
      
     if(req.body.password) { 
      parent.password = req.body.password;
  
     }
     const updatedEnsg=await parent.save();
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
  


/**
 * @desc Supprimer parent profile
 *  @route PUT /api/parent/:id
 *  @methode DELTE
 *  @acces Private
 */


const deleteParent= asyncHandler( async (req, res) => {
  const idToDelete = req.params.id;
  try {
    console.log(req.params.id)
    const parent = await Parent.findById(idToDelete);

    if (!parent) {
      return res.status(404).json({ message: "Parent not found" });
    }

    await Parent.deleteOne({ _id: idToDelete });

    res.status(200).json({ message: "Parent has been deleted" });
    
  } catch (error) {
    res.status(500).json({ message: "Error deleting Parent", error: error.message });
  }
});
/**
 * @desc Add enfants to parent with id 
 *  @route PUT /api/parent/enfants
 *  @methode PUT
 *  @acces Private
 */

const addenfantWithID = asyncHandler(async (req, res) => {
    const parent = await Parent.findById(req.parent._id);
    if (parent) {
      const eleveID = req.body.eleveID;
  
      const eleve = await Eleve.findById(eleveID);
      if (!eleve) {
        return res.status(404).json({ message: 'Eleve not found' });
      }

      const indexCours = parent.enfants.find(enfants => enfants._id.equals(eleveID));
      if (indexCours ==null) {
        
        parent.enfants.push(eleve);
        const updatedParent = await parent.save();
        res.status(200).json({
          _id: updatedParent._id,
          nom: updatedParent.nom,
          email: updatedParent.email,
          enfants: updatedParent.enfants, 
        });
      } else {

        res.status(200).json({message:'Enfant déja existe'})
      }
     
     
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  });

  /**
 * @desc Add enfants to parent with create new compte
 *  @route PUT /api/parent/enfants/new
 *  @methode PUT
 *  @acces Private
 */

const addenfantexist = asyncHandler(async (req, res) => {
  const parent = await Parent.findById(req.parent._id);
  let {nom , email , password,numtel,datedenaissance,prenom,nvEtude}=req.body;
  const userExists= await Eleve.findOne({email});

  if (parent) {

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
  
      // generateToken(res,eleve._id)

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
    
      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while sending the email' });
      }

  }else{
      res.status(400);
      throw new Error('Invalid eleve data')
  }


      
      parent.enfants.push(eleve);
      const updatedParent = await parent.save();
      res.status(200).json({
        _id: updatedParent._id,
        nom: updatedParent.nom,
        email: updatedParent.email,
        enfants: updatedParent.enfants, 
      });
 
   
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});



  /**
 * @desc  Get   All EeLve
 *  @route  /api/eleve/
 *  @methode GET
 *  @acces Public
 */

const getAllParents= asyncHandler( async (req,res) => {

  const parent = await Parent.find().select("-password ").populate("enfants");

    res.status(200).json(parent)});
  

export{
  modifyPassword,
  writeNewPassword,
  resetPassword,
  verifyUser,
  deleteParent,
  authUser,
  updateUserProfile,
  logoutUser,
  registerUser,
  getUserProfile,
  addenfantWithID,
  addenfantexist,
  getAllParents

}