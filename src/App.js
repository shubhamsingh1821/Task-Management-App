import Navbar from "./components/Navbar";
import About from "./components/About";
import {BrowserRouter as Router ,Routes , Route } from "react-router-dom"
import Home from "./components/Home.js";
import NoteState from "./Context/notes/NoteState";
import React from "react";
import Alert from "./components/Alert";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { useState } from "react";





function App() {

  // yeh laaye hain hum text utils mein se 

const [alert, setAlert] = useState(null);

const showAlert = (message, type)=>{
    setAlert({
      msg: message,
      type: type
    })
    setTimeout(() => {
        setAlert(null);
    }, 1500);
}
  return (
    <>
    <NoteState>
      <Router>
        <Navbar />
        <Alert alert={alert}/>
        <div className="container">
        <Routes>
          {/* home k andar hum showalert functions as props de dengye  */}
        <Route exact path="/" element={<Home showAlert = {showAlert}/>}/> 
        <Route exact path="/about" element={<About/>} /> 
        {/* yha path bna diye login and signup components k liye  */}
        <Route exact path="/login" element={<Login showAlert = {showAlert}/>}/> 
        <Route exact path="/signup" element={<Signup showAlert = {showAlert}/>}/> 
        </Routes>
        </div>
      </Router>
      </NoteState>
      {/* ab notestate k andar jo bhi saaare components hain vo hmari context vaali state ki value access krr paengey  */}
    </>
  );
}

export default App;
