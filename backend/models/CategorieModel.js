
import  mongoose  from  "mongoose";

const categorieSchema = new mongoose.Schema({
  nomCategorie: String,
});


const   Categorie = mongoose.model('Categorie',categorieSchema);
export default Categorie;