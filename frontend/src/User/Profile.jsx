import React, { useEffect } from 'react';
import '../UserStyles/Profile.css';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PageTitle from '../components/PageTitle';
import Loader from '../components/Loader';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Profile = () => {

    const {loading, isAuthenticated, user} = useSelector(state=>state.user);
    // console.log(user);
    // console.log(isAuthenticated);
    
    const navigate = useNavigate();
    useEffect(()=>{
        if(isAuthenticated === false){
            navigate('/login');
        }
    },[isAuthenticated])

  return (
    <>
    <Navbar/>
    <div className="profile-container">
        <PageTitle title={`Profile - ${user?.name}`}/>
        <div className="profile-image">
            <h1 className="profile-heading">My Profile</h1>
            <img src={user?.avatar?.url} alt="User Profile" className="profile-image" />
            <Link to={'/profile/edit'}>Edit Proifle</Link>
        </div>
        <div className="profile-details">
            <div className="profile-detail">
                <h2>Name:</h2>
                <p>{user?.name}</p>
            </div>
            <div className="profile-detail">
                <h2>username:</h2>
                <p>{user?.username}</p>
            </div>
            <div className="profile-detail">
                <h2>Email:</h2>
                <p>{user?.email}</p>
            </div>
            <div className="profile-detail">
                <h2>Joined On:</h2>
                <p>{user?.createdAt? String(user.createdAt).substring(0,10):'N/A'}</p>
            </div>
        </div>
        <div className="profile-buttons">
            <Link to={'/orders'}>My Orders</Link>
            <Link to={'/password/change'}>Change Password</Link>
        </div>
    </div>
    <Footer/>
    </>
  )
}

export default Profile
