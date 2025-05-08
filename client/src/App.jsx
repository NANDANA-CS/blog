import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar/Navbar.jsx';
import Profile from './pages/profile/Profile.jsx';
import Home from './components/home/Home.jsx';
import WriteBlog from './pages/write_section/Write.jsx';
import Login from './pages/login/Login';
import Signup from './pages/signup/Signup.jsx';

import Edit from './pages/edit/Edit.jsx';
import Userblog from './pages/userblogs/Userblog.jsx';

const App = () => {
  return (
    <BrowserRouter>
     

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/write' element={<WriteBlog />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />

        <Route path='/profile' element={<Profile />}>
          <Route index element={<Navigate to="userblog" replace />} />
          <Route path='edit' element={<Edit />} />
          <Route path='userblog' element={<Userblog />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
