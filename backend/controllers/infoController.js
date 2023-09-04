import asyncHandler from "express-async-handler"
import Info from '../models/infoModel.js'



/**
 * @desc add info
 *  @route POST /api/info
 *  @methode POST
 *  @acces private
 */

const addInfo= asyncHandler( async (req,res) => {
    const {titre , description , adresse,email,numtel,facebook,youtube,instgram,linkedin}=req.body;

 
    const info = await Info.create({
        titre,
        description,
        adresse,
        numtel,
        facebook,
        youtube,
        instgram,
        linkedin,
        email
    })

    if(info){
    
        const redirectUrl = req.query.redirect || '/';
        res.redirect(redirectUrl);

    }else{
        res.status(400);
        throw new Error('Invalid info data')
    }
   
    // res.status(200).json({message:'Info adedd'})
});




/**
 * @desc  Get  info
 *  @route  /api/info/get
 *  @methode GET
 *  @acces Public
 */

const getInfo= asyncHandler( async (req,res) => {
    const info = await Info.find();

    res.status(200).json(info)});

/**
 * @desc Update   info
 *  @route PUT /api/info/update
 *  @methode PUT
 *  @acces Private
 */

const updateInfo=asyncHandler( async (req, res) => {
    const idToUpdate = req.params.id.trim();

    try {
      const info = await Info.findById(idToUpdate);
  
      if (!info) {


        return res.status(404).json({ message: "Info not found" });
      }
  
      const newData = {
        titre: req.body.titre|| info.titre,
        description: req.body.description|| info.description,
        adresse: req.body.adresse || info.adresse,
        facebook: req.body.facebook|| info.facebook,
        linkedin: req.body.linkedin|| info.linkedin,
        instgram: req.body.instgram|| info.instgram,
        youtube: req.body.youtube|| info.youtube,
        numtel: req.body.numtel|| info.numtel,
        email: req.body.email|| info.email,
      };


      info.set(newData);


      const updatedInfo = await info.save();
  
      res.status(200).json(updatedInfo);
    } catch (error) {
      res.status(500).json({ message: "Error updating info", error: error.message });
    }
  })

const deleteInfo=asyncHandler(async (req, res) => {
    const idToDelete = req.params.id;
    try {
      const info = await Info.findById(idToDelete);
  
      if (!info) {
        return res.status(404).json({ message: "Info not found" });
      }
  
      await Info.deleteOne({ _id: idToDelete });
  
      res.status(200).json({ message: "Info has been deleted" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting info", error: error.message });
    }
  })
export{

    addInfo,
    getInfo,
    updateInfo,
    deleteInfo

}