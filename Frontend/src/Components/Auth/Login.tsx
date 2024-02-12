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
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={signInSubmit}>
        <div>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit">Log In</button>
      </form>
      {errorMessage}
    </div>
  );
}

export default Login;
