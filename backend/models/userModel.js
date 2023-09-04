import  mongoose  from  "mongoose";
import bcrypt from 'bcryptjs'
const notificationSchema = mongoose.Schema({

    text:{
        type:String ,
        require: true,

    },
    read:{
        type:Boolean ,
        require: true,
        default:false

    },

}, {
  timestamps: true,
});

const userSchema  = mongoose.Schema({
    name:{
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
    resetPassword:{
        type:String ,
    },
    notifications: [notificationSchema], 
},{
    timestamps:true
});
userSchema.pre('save',async function (next) {
    if(!this.isModified('password')){
        next();

    }
    const salt = await bcrypt.genSalt(10);
    this.password= await bcrypt.hash(this.password, salt)
});
userSchema.methods.matchPassword=async function (enteredPassword){

    return await bcrypt.compare(enteredPassword,this.password);
    
    

}



userSchema.pre('save',async function (next) {
    // if(!this.isModified('resetPassword')){
    //     next();

    // }
    // try  {
    //     const salt =await  bcrypt.genSalt(10);
    //     this.resetPassword= await bcrypt.hash(this.resetPassword,salt)

    // } catch (error) {
    //     console.log(error)
    // }
});


userSchema.methods.matchRestPassword=async function (enteredPassword){
    console.log('helo')
    return await bcrypt.compare(enteredPassword,this.resetPassword);
    }


const   User = mongoose.model('User',userSchema);
export default User;