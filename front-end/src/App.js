import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import logo from './logo.svg';
import City from "./paths/MyCity.js";
import Leaderboard from "./paths/Leaderboard.js";
import Navbar from "./paths/Navbar.js";
import './App.css';


function App() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Routes>
        <Route path="/" element={<Navbar/>}>
          <Route index element={<City/>}/>
          <Route path="leaderboard" element={<Leaderboard/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
