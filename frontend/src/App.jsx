import React from 'react';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path='/product/:id' element={<ProductDetails />}></Route>
      </Routes>
    </Router>
  )
}

export default App
