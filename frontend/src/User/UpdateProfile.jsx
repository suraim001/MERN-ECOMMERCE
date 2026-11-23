import React, { useEffect, useState } from 'react';
import '../UserStyles/Form.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeErrors, removeSuccess, updateProfile } from '../features/users/userSlice';
import Loader from '../components/Loader';
import PageTitle from '../components/PageTitle';


const UpdateProfile = () => {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [avatar, setAvatar] = useState('');
    const [avatarPreview, setAvatarPreview] = useState('./images/profile.png');
    // console.log(avatarPreview);
    
    const {user, error, success, message, loading} = useSelector(state=>state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const updateProfileImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Avatar must be smaller than 5 MB", { position: 'top-center', autoClose: 3000 });
            e.target.value = "";
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2) {
                setAvatarPreview(reader.result);
                setAvatar(reader.result);
            }
        }
        reader.onerror = (error) => {
            toast.error("Couldn't read the file");
        }
        reader.readAsDataURL(file);
        return;
    }

    const submitUpdate = (e) => {
        e.preventDefault();
        const myForm = new FormData();
        myForm.set('name', name);
        myForm.set('username', username);
        myForm.set('avatar', avatar);
        dispatch(updateProfile(myForm));
    }
    useEffect(()=>{
        if(error){
            toast.error(error, {position:'top-center', autoClose:3000});
            dispatch(removeErrors());
        }
    },[dispatch, error]);

    useEffect(()=>{
        if(success){
            toast.success(message, {position:'top-center', autoClose:3000});
            dispatch(removeSuccess());
            navigate('/profile');
        }
    },[dispatch, success]);

    useEffect(()=>{
        if(user){
            setName(user.name);
            setUsername(user.username);
            setAvatarPreview(user.avatar?.url || './images/profile.png');
        }
    },[user]);

    return (
        <>
        {loading?(<Loader/>):(<>
            <Navbar />
            <PageTitle title={'Update - Profile'}/>
            <div className="container update-container">
                <div className="form-content">
                    <form className="form" encType='multipart/form-data' onSubmit={submitUpdate}>
                        <h2>Update Profile</h2>
                        <div className="input-group avatar-group">
                            <img src={avatarPreview} alt="Profile Picture" className="avatar" />
                            <input type="file" accept='image/' className="file-input" onChange={updateProfileImage} name='avatar'/>
                        </div>
                        <div className="input-group">
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} name='name'/>
                        </div>
                        <div className="input-group">
                            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} name='username'/>
                        </div>
                        <button className="authBtn">Update</button>
                    </form>
                </div>
            </div>

            <Footer />
        </>)}
        </>
    )
}

export default UpdateProfile
