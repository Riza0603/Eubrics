import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';
import './App.css';
import { ToastContainer } from 'react-toastify';


const App = () => {
  return (
    <Router>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home/>} />
        </Routes>
        <ToastContainer />
    </Router>
  );
};

export default App;
