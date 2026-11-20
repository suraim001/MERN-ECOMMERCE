import React, { useState } from 'react';
import '../UserStyles/UserDashboard.css'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { logout, removeSuccess } from '../features/users/userSlice';

const UserDashboard = ({ user }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [menuVisible, setMenuVisible] = useState(false);

    const toggleMenu = () => {
        setMenuVisible(!menuVisible);
    }

    const orders = () => {
        navigate('/orders/me');
    }
    const profile = () => {
        navigate('/profile');
    }
    const logoutUser = () => {
        dispatch(logout())
            .unwrap()
            .then(() => {
                toast.success("Logout Successful", { position: 'top-center', autoClose: 3000 });
                dispatch(removeSuccess());
                navigate('/login');
            })
            .catch((error) => {
                toast.error(error.message || 'Logout Failed', { position: 'top-center', autoClose: 3000 });
            })

    }
    const dashboard = () => {
        navigate('/admin/dashboard');
    }
    const options = [
        { name: 'Orders', funcName: orders },
        { name: 'Account', funcName: profile },
        { name: 'Logout', funcName: logoutUser },
    ]
    if (user.role === 'admin') {
        options.unshift({
            name: 'Admins Dashboard', funcName: dashboard
        })
    }

    return (
        <>
            <div className={`overlay ${menuVisible? 'show' : ''}`} onClick={toggleMenu}></div>
            <div className="dashboard-container">
                <div className="profile-header" onClick={toggleMenu}>
                    <img src={user?.avatar?.url} alt="profile-picture" className='profile-avatar' />
                    <span className="profile-name">{user?.name || "User"}</span>
                </div>
                {menuVisible && (<div className="menu-options">
                    {options.map((item) => (
                        <button
                            key={item.name}
                            className="menu-option-btn"
                            onClick={() => { toggleMenu(); item.funcName(); }}
                        >
                            {item.name}
                        </button>
                    ))}
                </div>)}
            </div>
        </>
    )
}

export default UserDashboard
