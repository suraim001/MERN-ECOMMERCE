import React, { useEffect, useState } from 'react';
import '../UserStyles/Form.css';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { useSelector, useDispatch } from 'react-redux';
import { register, removeErrors, removeSuccess } from '../features/user/userSlice';

const Register = () => {

    const [user, setUser] = useState({
        name: '',
        username: '',
        email: '',
        password: ''
    });
    const { name, username, email, password } = user;
    const [avatar, setAvatar] = useState("");
    const [avatarPreview, setAvatarPreview] = useState("./images/profile.png");
    const {success, loading, error} = useSelector(state => state.user)
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const registerDataChange = (e) => {
        if (e.target.name === 'avatar') {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setAvatarPreview(reader.result);
                    setAvatar(reader.result);
                }
            };
            reader.readAsDataURL(file);
            return;
        }

        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const registerSubmit = (e) => {
        e.preventDefault();
        dispatch(register({ name, username, email, password }));
    }
    useEffect(()=>{
        if(error){
            toast.error(error, {position:'top-center', autoClose:3000});
            dispatch(removeErrors());
        }
    },[dispatch, error]);
    useEffect(()=>{
        if(success){
            toast.success("Registration Successful", {position:'top-center', autoClose:3000});
            dispatch(removeSuccess());
            navigate('/login');
        }
    },[dispatch, success]);


    return (
        <div className="form-container container">
            <div className="form-content">
                <form className="form" onSubmit={registerSubmit} encType='multipart/form-data'>
                    <h2>Sign Up</h2>
                    <div className="input-group">
                        <input type="text" placeholder='Name' name='name' required value={name} onChange={registerDataChange} />
                    </div>
                    <div className="input-group">
                        <input type="text" placeholder='Username' name='username' value={username} required onChange={registerDataChange} />
                    </div>
                    <div className="input-group">
                        <input type="email" placeholder='Email' name='email' value={email} required onChange={registerDataChange} />
                    </div>
                    <div className="input-group">
                        <input type="password" placeholder='Password' name='password' value={password} required onChange={registerDataChange} />
                    </div>
                    <div className="input-group avatar-group">
                        <img src={avatarPreview} alt="Avatar Preview" className='avatar' />
                        <input type="file" placeholder='' name='avatar' className='file-input' accept='image/*' onChange={registerDataChange} />
                    </div>
                    <button className="authBtn">Sign Up</button>

                    <p className="form-links">
                        Already have an account?<Link to={'/login'}>Login</Link>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default Register
