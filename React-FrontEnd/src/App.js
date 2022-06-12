import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
import Register from './Components/Register';
import Login from './Components/Login';
import Home from './Components/Home';
import Layout from './Components/Layout';
import Editor from './Components/Editor';
import Admin from './Components/Admin';
import Missing from './Components/Missing';
import Unauthorized from './Components/Unauthorized';
import Lounge from './Components/Lounge';
import LinkPage from './Components/LinkPage';
import RequireAuth from './Components/RequireAuth';
import {Routes,Route} from 'react-router-dom'
import PersistLogin from "./Components/PersistLogin";

function App() {
 
  // const Roles [] = {}

  return (
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* public routes */}
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="linkpage" element={<LinkPage />} />
          <Route path="unauthorized" element={<Unauthorized />} />

          {/* we want to protect these routes */}
          <Route element={<PersistLogin/>}>
            <Route element={<RequireAuth allowedRoles={"Student"} />} >
          
              <Route path="/" element={<Home />} />
            
              <Route path="editor" element={<Editor />} />
      
              <Route path="admin" element={<Admin />} />
          
              <Route path="lounge" element={<Lounge />} />
            </Route>
          </Route>

          {/* catch all */}
          <Route path="*" element={<Missing />} />
        </Route>
    </Routes>
  );
}
export default App;
