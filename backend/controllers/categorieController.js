import asyncHandler from "express-async-handler"
import Formation from "../models/formationModel.js";
import Ensg from "../models/ensgModel.js";
import Categorie from "../models/CategorieModel.js";
import Eleve from '../models/eleveModel.js'


/**
 * @desc add categorie
 *  @route POST /api/categorie
 *  @methode POST
 *  @acces private
 */

const addCategorie= asyncHandler( async (req,res) => {
  try {
    const { nomCategorie } = req.body;

    const categorie = new Categorie({ nomCategorie});
    await categorie.save();

    res.status(201).json(categorie);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
 });

/**
 * @desc  Get   All categorie
 *  @route  /api/categorie/
 *  @methode GET
 *  @acces Private
 */

const getcategorie= asyncHandler( async (req,res) => {
    const categorie = await Categorie.find();
    
      
    res.status(200).json(categorie)});


/**
*  @desc Update  categorie
*  @route PUT /api/categorie
*  @methode PUT
*  @acces Private
*/

const updateCategorie= asyncHandler( async (req, res) => {
    const idToUpdate = req.params.id.trim();

    try {
      const categorie = await Categorie.findById(idToUpdate);
  
      if (!categorie) {
        console.log("categorie not found")

        return res.status(404).json({ message: "categorie not found" });
      }
    //   if (!ensg) {
    //     return res.status(404).json({ message: 'ensg not found' });
    //   }
      
      const newData = {
        nomCategorie: req.body.nomCategorie|| categorie.nomCategorie,

    
      };
    //   const eleve = await Eleve.find();

    //   eleve.forEach( async (element) => {
        
   
   
    //     element.inscription.forEach(function callback(value, index) {
    //       console.log("2")
    //       if(value._id==req.params.id.trim()){
    //         element.inscription.splice(index, 1);
    //       element.inscription.push(formation);
      
           
    //       }
    //     });
    //     element.favorite.forEach(function callback(value, index) {
    //       if(value._id==req.params.id.trim()){
    //         element.favorite.splice(index, 1);
    //         element.favorite.push(formation);


              
     
    //       }
    //     });
    //     await element.save()
    
    //   });
      await categorie.set(newData);
 

    await categorie.save();
    res.json({ message: 'categorie modifié avec succès' });

    } catch (error) {
      res.status(500).json({ message: "Error updating categorie", error: error.message });
    }
  });


/**
*  @desc Delete  categoorie 
*  @route PUT /api/categorie/:id
*  @methode delete
*  @acces Private
*/
const deleteCategorie = asyncHandler(async (req, res)=> {
  const categorieId = req.params.id;

  try {
    const categorie = await Categorie.findById(categorieId);

    if (!categorie) {
      return res.status(404).json({ message: 'Categorie non trouvée' });
    }

    // const eleve = await Eleve.find();
    // eleve.forEach(element => {
      

 
    //   element.inscription.forEach(function callback(value, index) {
    //     if(value._id==formationId){
        
    //       element.inscription.splice(index, 1);
      
    //     }
    //   });
    //   element.favorite.forEach(function callback(value, index) {
    //     if(value._id==formationId){
        
    //       element.favorite.splice(index, 1);

   
    //     }
    //   });
    //   element.save()
  
    // });
    await categorie.deleteOne();

    console.log('categorie supprimée avec succès');


    res.json({ message: 'categorie supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la categorie :', error);
    res.status(500).json({ message: 'Une erreur est survenue lors de la suppression de la categorie' });
  }



  
});






export{
    addCategorie,
    getcategorie,
    updateCategorie,
    deleteCategorie
}