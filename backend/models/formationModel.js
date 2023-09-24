import  mongoose  from  "mongoose";

const reponsesSchema = mongoose.Schema({
  reponse: {  

      type:String ,
      require: true,
  
  },
  correct: {  

    type:Boolean ,
    require: true,

},
   }, {
    timestamps: true,
  });

const questionsSchema = mongoose.Schema({

    question:{
        type:String ,
        require: true,

    },
    reponses: [reponsesSchema],

}, {
  timestamps: true,
});


const commentSchema = mongoose.Schema({
    texte: {
      type: String,
      require: true,
    },
    ensg: { type: mongoose.Schema.Types.ObjectId, ref: 'Ensg' },
    eleve:{ type: mongoose.Schema.Types.ObjectId, ref: 'Eleve' }
  }, {
    timestamps: true,
  });
  const miniProjetSchema = mongoose.Schema({
    titre: {
      type: String,
      require: true,
    },
    url: {
      type: String,

    },
    eleve:{ type: mongoose.Schema.Types.ObjectId, ref: 'Eleve' }
  }, {
    timestamps: true,
  });
  const ressourcesSchema = mongoose.Schema({
    titre: {
      type: String,
      require: true,
    },
    url: {
      type: String,

    },
  }, {
    timestamps: true,
  });
const formationSchema  = mongoose.Schema({
    nom:{
        type:String ,
        require: true,
    },
    description:{
        type:String ,
        require: true,
    },
    prix:{
      type:String ,
      require: true,
  
  },
    miniProjets:[miniProjetSchema],
    cours: [
    {   
        titre:{
      type:String ,
      require: true,

  },


    description:{
      type:String ,
      require: true,
  },
    url:{
      type:String ,
      require: true,
  }, 
  exercice:{
    type:String ,
    require: true,
}, 
  commentaires: [commentSchema],
  ressources: [ressourcesSchema],

  quiz:{ 
    questions:[questionsSchema],
    note:{
      type:String ,
      require: true,
  }, 
  }

}], 

   ensg: { type: mongoose.Schema.Types.ObjectId, ref: 'Ensg' }, 

   categorie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Categorie', // référence au modèle Categorie
  },
   
   
},{
    timestamps:true
});




 formationSchema.pre('deleteOne', { document: true }, function(next)  {

console.log(this)
if(this.cours)
  next()


  })

const   Formation = mongoose.model('Formation',formationSchema);
export default Formation;