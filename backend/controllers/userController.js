import asyncHandler from "express-async-handler"
import User from '../models/userModel.js'
import generateToken   from "../utils/generateToken.js";
import nodemailer from 'nodemailer';
/**
 * @desc Auth user/set token
 *  @route POST /api/users/auth
 *  @methode POST
 *  @acces public
 */

const authUser= asyncHandler( async (req,res) => {
    const {email,password}=req.body;
    const user= await User.findOne({email})
    
    if(user && (await user.matchPassword(password))){
        generateToken(res,user._id)
        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
        
        });

    }else{
        res.status(401);
        throw new Error('Invalid email or password')
    }
});
/**
 * @desc Register a new  user
 *  @route POST /api/users
 *  @methode POST
 *  @acces public
 */

const registerUser= asyncHandler( async (req,res) => {
    const {name , email , password}=req.body;
    const userExists= await User.findOne({email});

    if(userExists){
        res.status(400);
        throw new Error('user already exists');

    }
    const user = await User.create({
        name,
        email,
        password
    })
    if(user){
        generateToken(res,user._id)
        res.status(201).json({
            _id:user._id,
            name:user.nam,
            email:user.email
        });

    }else{
        res.status(400);
        throw new Error('Invalid user data')
    }
   
    res.status(200).json({message:'Register User'})
});


/**
 * @desc Logout   user
 *  @route  /api/users
 *  @methode POST
 *  @acces public
 */

const logoutUser= asyncHandler( async (req,res) => {
   res.cookie('jwt','',{
    httpOnly:true,
    expires:new Date(0),
   });
   res.status(200).json({message:'user logged out'})
});
/**
 * @desc ResetPassword
 *  @route POST /api/users/resetPassword
 *  @methode POST
 *  @acces public
 */
const resetPassword= asyncHandler( async (req,res) => {
    const {name , email }=req.body;
    const userExists= await User.findOne({email});
  
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
            subject: 'Hello '+ userExists.name +' from Future visions ',
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
        </body>
    `
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
 *  @route POST /api/users/writePassword
 *  @methode POST
 *  @acces public
 */
  const writeNewPassword= asyncHandler( async (req,res,next)=> { 
    const { resetPassword, email, }=req.body;
    const userExists= await User.findOne({email});
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
    // check if id eist in data
   res.send(token)
   } );

   /**
 * @desc modificaion de password
 *  @route POST /api/modifierPassword
 *  @methode POST
 *  @acces public
 */

const modifyPassword= asyncHandler( async (req,res) => {
    const {  email , password}=req.body;
    const userExists= await User.findOne({email});

    if(!userExists){
        res.status(400);
        throw new Error('user not found');

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
 * @desc  Get   user profile
 *  @route  /api/users/profile
 *  @methode GET
 *  @acces Private
 */

const getUserProfile= asyncHandler( async (req,res) => {
    const user = {
        _id:req.user._id,
        name:req.user.name,
        email:req.user.email,
        notifications:req.user.notifications,
        notificationsUnread: req.user.notifications.filter(notification => !notification.read)

    }
    res.status(200).json(user)
});

/**
 * @desc Update   user profile
 *  @route PUT /api/users/profile
 *  @methode PUT
 *  @acces Private
 */

const updateUserProfile= asyncHandler( async (req,res) => {
   const user = await User.findById(req.user._id);
   if(user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if(req.body.password) { 
        user.password = req.body.password;

    }
    const updatedUser=await user.save();
    res.status(201).json({
        _id:user._id,
        name:user.name,
        email:user.email
    });
   }else{
        res.status(404);
        throw new Error('User not found')
   }
});
/**
 * @desc Update   user profile
 *  @route PUT /api/users/profile
 *  @methode PUT
 *  @acces Private
 */

const updateUserNotification= asyncHandler( async (req,res) => {
    const user = await User.findById(req.user._id);
    if(user) {
        user.notifications.forEach(element => {
            element.read=true
        });
     await user.save();
     res.status(201).json({
         _id:user._id,
         name:user.name,
         email:user.email
     });
    }else{
         res.status(404);
         throw new Error('User not found')
    }
 });
export{
    updateUserNotification,
    modifyPassword,
    writeNewPassword,
    resetPassword,
    authUser,
    updateUserProfile,
    logoutUser,
    registerUser,
    getUserProfile,
    

}