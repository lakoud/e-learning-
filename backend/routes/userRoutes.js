import express from "express"
import { 
    modifyPassword,
    writeNewPassword,
    resetPassword,  
    authUser,
    updateUserProfile,
    logoutUser,
    registerUser,
    getUserProfile,
    updateUserNotification

} from "../controllers/userController.js";
import { adminprotect } from "../middleware/authMiddleware.js"; 
const router=express.Router();

router.post('/',registerUser)
router.post('/auth',authUser)
router.post('/logout',logoutUser)
router.route('/profile').get(adminprotect,getUserProfile).put(adminprotect,updateUserProfile);

router.route('/notifications').put(adminprotect,updateUserNotification);

router.post('/resetPassword',resetPassword)
router.post('/writePassword',writeNewPassword)

// router.post('/modifierPassword',,modifyPassword)
router.route('/modifierPassword').post(adminprotect,modifyPassword);

export default router;