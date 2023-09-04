import  mongoose  from  "mongoose";
import bcrypt from 'bcryptjs'

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
    formation: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Formation' }], // Propriété de référence aux cours associés

   
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