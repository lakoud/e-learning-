import  mongoose  from  "mongoose";
import bcrypt from 'bcryptjs'
import Eleve from './eleveModel.js'
const parentSchema  = mongoose.Schema({
    nom:{
        type:String ,
        require: true,
    },
    prenom:{
        type:String ,
        require: true,
    },
   
  
    email:{
        type:String ,
        require: true,
        unique:true,
    },
    password:{
        type:String ,
        require: true,
    },
    numtel:{
        type:String ,
        require: true,
    },
    isActive:{
        type:Boolean ,
        default:false,
    },
    activationCode:{
        type:String ,
    },
    resetPassword:{
        type:String ,
    },
    photo:{
        type:String ,
    },
    genre:{
        type:String ,
    },
    enfants: [{
        type: mongoose.Schema.Types.ObjectId, // Specify the type as ObjectId
        ref: 'Eleve', // Reference the Eleve model
    }],

},{
    timestamps:true
});
parentSchema.pre('save',async function (next) {
    if(!this.isModified('password')){
        next();

    }
    const salt = await bcrypt.genSalt(10);
    this.password= await bcrypt.hash(this.password, salt)
});

parentSchema.methods.matchPassword=async function (enteredPassword){

    return await bcrypt.compare(enteredPassword,this.password);
    
    

}

const   Parent = mongoose.model('Parent',parentSchema);
export default Parent;