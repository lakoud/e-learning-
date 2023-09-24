import  mongoose  from  "mongoose";
import bcrypt from 'bcryptjs'
const rendezvousSchema = mongoose.Schema({
    date: {
      type: String,
      require: true,
    },
    description: {
        type: String,
      },
    accepter: {
      type: Boolean,
      require: true,
      default:false,

    },
    eleve:{ type: mongoose.Schema.Types.ObjectId, ref: 'Eleve' }
  }, {
    timestamps: true,
  });
const ensgSchema  = mongoose.Schema({
    nom:{
        type:String ,
        require: true,
    },
    prenom:{
        type:String ,
        require: true,
    },
    numtel:{
        type:String ,
        require: true,
    },
    email:{
        type:String ,
        require: true,
    },
    password:{
        type:String ,
        require: true,
    },
    photo:{
        type:String ,
    },
    genre:{
        type:String ,
    },
    formation: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Formation' }], // Propriété de référence aux cours associés
    rendezVous:[rendezvousSchema],

   
},{
    timestamps:true
});
ensgSchema.pre('save',async function (next) {
    if(!this.isModified('password')){
        next();

    }
    const salt = await bcrypt.genSalt(10);
    this.password= await bcrypt.hash(this.password, salt)
});

ensgSchema.methods.matchPassword=async function (enteredPassword){

    return await bcrypt.compare(enteredPassword,this.password);
    
    

}

const   Ensg = mongoose.model('Ensg',ensgSchema);
export default Ensg;