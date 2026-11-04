import React from 'react';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Products from './pages/Products';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path='/product/:id' element={<ProductDetails />}></Route>
        <Route path='/products' element={<Products/>}/>
        <Route path='/products/:keyword' element={<Products/>}/>
      </Routes>
    </Router>
  )
}

export default App
