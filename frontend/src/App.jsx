import React, { useEffect } from 'react';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Products from './pages/Products';
import Register from './User/Register';
import Login from './User/Login';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from './features/users/userSlice';
import UserDashboard from './User/UserDashboard';
import Profile from './User/Profile';


const App = () => {

  const {isAuthenticated, user} = useSelector(state=>state.user);
  const dispatch = useDispatch()
  useEffect(()=>{
    if(isAuthenticated){
      dispatch(loadUser());
    }
  },[dispatch]);
  // console.log(isAuthenticated,user);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path='/product/:id' element={<ProductDetails />}></Route>
        <Route path='/products' element={<Products/>}/>
        <Route path='/products/:keyword' element={<Products/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/profile' element={<Profile/>}/>
      </Routes>
      {isAuthenticated && <UserDashboard user={user}/>}
    </Router>
  )
}

export default App
