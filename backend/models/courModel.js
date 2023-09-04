import  mongoose  from  "mongoose";
import bcrypt from 'bcryptjs'

const CoursSchema  = mongoose.Schema({
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
    formation: { type: mongoose.Schema.Types.ObjectId, ref: 'Formation' }, 

    
   
   
   
   
},{
    timestamps:true
});



const   Cours = mongoose.model('Cours',CoursSchema);
export default Cours;