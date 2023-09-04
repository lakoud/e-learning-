import {  Navigate , Outlet} from "react-router-dom";
import { useSelector } from "react-redux";

import Sidebar  from "../screens/global/Sidebar";

import React from 'react'
import Topbar from "../screens/global/Topbar";

const PrivateRoute = () => {
    const { userInfo } =useSelector((state)=>state.auth);
    return userInfo ? 
<>
    <div className="app" >
    <Sidebar/>
    <main className="content">
    <Topbar  />
    <Outlet /> 
 
    </main>

    </div>
    </>
   
    : <><Navigate to='/login' replace/></>;
}

export default PrivateRoute