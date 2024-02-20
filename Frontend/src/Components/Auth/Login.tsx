import { signInWithEmailAndPassword, UserCredential } from 'firebase/auth';
import React, { useState } from 'react';
import "./Login.css"
import { useNavigate } from "react-router-dom";
import { auth } from '../../base';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../Store/store';
import { signIn } from '../../Store/authSlice';
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>()
  
  const [errorMessage, setErrorMessage] = useState('')

  const signInSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential: UserCredential) => {
        dispatch(signIn(userCredential.user))
        navigate('/profile');
    })
      .catch((error: Error) => {
        console.log(error);
        setErrorMessage(error.message)
      });
  };

  return (
    <>
      <form onSubmit={signInSubmit}>
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" style={{ marginBottom: '10px' }} />
        <input type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Password" style={{ marginBottom: '20px' }} />
        <button type="submit" style={{ width: "-webkit-fill-available", backgroundColor: '#FFD700', padding: '10px', border: 'none', borderRadius: '5px', marginBottom: '10px' }}>Sign in</button>
      </form>
    </>
  );
}

export default Login;
