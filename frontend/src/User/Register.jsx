import React from 'react';
import '../UserStyles/Form.css';
import { Link } from 'react-router-dom';

const Register = () => {
  return (
    <div className="form-container container">
        <div className="form-content">
            <form className="form">
                <h2>Sign Up</h2>
                <div className="input-group">
                    <input type="text" placeholder='Name' name='name'/>
                </div>
                <div className="input-group">
                    <input type="text" placeholder='Username' name='username'/>
                </div>
                <div className="input-group">
                    <input type="email" placeholder='Email' name='email'/>
                </div>
                <div className="input-group">
                    <input type="password" placeholder='Password' name='password'/>
                </div>
                <div className="input-group avatar-group">
                    <input type="file" placeholder='' name='avatar' className='file-input' accept='image'/>
                    <img src="" alt="Avatar Preview" />
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
