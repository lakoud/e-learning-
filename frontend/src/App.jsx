import {  Route, Routes } from "react-router-dom"
import 'react-toastify/dist/ReactToastify.css';
import "./assets/style.css"
import { ColorModeContext , useMode } from "./theme";
import { CssBaseline,ThemeProvider } from "@mui/material";
import Dashoard from "./screens/dashboard";
import  LoginScreen  from './screens/auth/LoginScreen.jsx'
import PrivateRoute from './components/PrivateRoute';
import Eleves from './screens/Eleves';
import Enseignants from "./screens/enseignant";
import InfoGenrale from "./screens/InfoGnerale";
import Edit from "./screens/InfoGnerale/edit";
import Add from "./screens/InfoGnerale/add";
import DetailsEnsg from "./screens/enseignant/details";
import ListFormation from "./screens/formation";
import EditFormation from "./screens/formation/edit";
import AddFormation from "./screens/formation/add";
import DetailsEleve from "./screens/Eleves/details";
import AddEnsg from "./screens/enseignant/add";
import { ActivationPage } from "./components/ActivationPage";
import { ResetPassword } from "./screens/auth/reset-password";
import { EnterCode } from "./screens/auth/resetCodeScurite";
import { NewPassword } from "./screens/auth/NewPassword";
import Footer  from "./screens/global/Footer";
import {ProfileScreen}  from "./screens/ProfileScreen";
import { ToastContainer } from "react-toastify";
import AddCategorie from "./screens/categorie/add";
import ListCategories from "./screens/categorie";
import EditCategorie from "./screens/categorie/edit";
import NotFound from "./screens/global/NotFound";
import Parents from "./screens/Parents";
import DetailsParent from "./screens/Parents/details";

const App=()=>{
  const [theme,colorMode]=useMode();
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme} >
        <CssBaseline/>
    
        {/* <Sidebar/> */}
   
       

      <Routes  >
      <Route  path='/login' index={true}  element={<LoginScreen/> }/>
      <Route  path='/resetPassword'  element={<ResetPassword/> }/>
      <Route  path='/enterCode'  element={<EnterCode/> }/>
      <Route  path='/newPassword'  element={<NewPassword/> }/>


     
      <Route  path='/confirm/:activationCode' element={<ActivationPage/> }/>
      <Route  path='/*' element={<NotFound/> }/> 


      <Route path='' element={<PrivateRoute/> }>
      <Route  path='/' element={<Eleves/> }/>
      {/* Eleves */}
      <Route  path='/Eleves' element={<Eleves/> }/>
      <Route  path='/DetailsEleve' element={<DetailsEleve/> }/> 
            {/* Parents */}
            <Route  path='/Parents' element={<Parents/> }/>
      <Route  path='/DetailsParent' element={<DetailsParent/> }/> 
      {/* Enseignants */}
      <Route  path='/Enseignants' element={<Enseignants/> }/>
      <Route  path='/addensg' element={<AddEnsg/> }/>
      <Route  path='/DetailsEnsg' element={<DetailsEnsg/> }/>

      {/* Info generale */}
      <Route  path='/InfoGenrale' element={<InfoGenrale/> }/>
      <Route  path='/edit' element={<Edit/> }/>
      <Route  path='/add' element={<Add/> }/>

      {/* Categorie */}
      <Route  path='/AddCategorie' element={<AddCategorie/> }/> 
      <Route  path='/Categories' element={<ListCategories/> }/> 
      <Route  path='/EditCategorie' element={<EditCategorie/> }/>

      

      {/* Formation */}
      <Route  path='/Formations' element={<ListFormation/> }/>     
      <Route  path='/EditFormations' element={<EditFormation/> }/>
      <Route  path='/AddFormation' element={<AddFormation/> }/> 

      <Route  path='/profile' element={<ProfileScreen/> }/> 

      
      </Route>

    </Routes>
       
    <CssBaseline/>

      </ThemeProvider>
 
      <ToastContainer position="bottom-right"/>

    </ColorModeContext.Provider>
  )
}
export default App