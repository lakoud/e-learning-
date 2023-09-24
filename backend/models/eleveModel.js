import  mongoose  from  "mongoose";
import bcrypt from 'bcryptjs'

const eleveSchema  = mongoose.Schema({
    nom:{
        type:String ,
        require: true,
    },
    prenom:{
        type:String ,
        require: true,
    },
    datedenaissance:{
        type:String ,
        require: true,
    },
    nvEtude:{
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
    favorite: [], 
    inscription: [], 

},{
    timestamps:true
});
eleveSchema.pre('save',async function (next) {
    if(!this.isModified('password')){
        next();

    }
    const salt = await bcrypt.genSalt(10);
    this.password= await bcrypt.hash(this.password, salt)
});

eleveSchema.methods.matchPassword=async function (enteredPassword){

    return await bcrypt.compare(enteredPassword,this.password);
    
    

}

const   Eleve = mongoose.model('Eleve',eleveSchema);
export default Eleve;