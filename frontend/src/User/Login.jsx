import React, { useEffect, useState } from 'react';
import '../UserStyles/Form.css';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, removeErrors, removeSuccess } from '../features/users/userSlice';
import { toast } from 'react-toastify';

const Login = () => {

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginUsername, setLoginUsername] = useState("");
  const [loginWithEmail, setLoginWithEmail] = useState(true);

  const { error, loading, success, isAuthenticated } = useSelector(state => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loginSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email: loginEmail, username: loginUsername, password: loginPassword }));

  }
  useEffect(() => {
    if (error) {
      toast.error(error, { position: 'top-center', autoClose: 3000 });
      dispatch(removeErrors());
    }

  }, [dispatch, error]);
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated]);
  useEffect(() => {
    if (success) {
      toast.success('Login Successful', { position: 'top-center', autoClose: 3000 });
      dispatch(removeSuccess());
    }
  }, [dispatch, success]);

  return (
    <div className="form-container container">
      <div className="form-content">
        <form className="form" onSubmit={loginSubmit}>
          {loginWithEmail ? (
            <div className="input-group">
              <input type="email" placeholder='Email' value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
            </div>) : (
            <div className="input-group">
              <input type='text' placeholder='Username' value={loginUsername} onChange={(e)=>setLoginUsername(e.target.value)} />
            </div>
            )}
          <div className="input-group">
            <input type="password" placeholder='Password' value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
          </div>
          <p className='form-links' > <a onClick={(e)=>setLoginWithEmail(!loginWithEmail)}>{loginWithEmail?(<span>Login with username instead</span>) : <span>Login with email instead</span>}</a></p>
          <button className='authBtn'>Sign In</button>
          <p className="form-links">Forgot your password? <Link to={'/password/forgot'}>Reset Here</Link></p>
          <p className="form-links">Don't have an account? <Link to={'/register'}>Sign Up</Link></p>
        </form>
      </div>
    </div>
  )
}

export default Login
