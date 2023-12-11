import { signInWithEmailAndPassword, UserCredential } from 'firebase/auth';
import React, { useContext, useState } from 'react';
import "./Login.css"
import { useNavigate } from "react-router-dom";
import { auth } from '../../base';
import { AuthContext } from "./AuthContext"

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { signIn } = useContext(AuthContext);
  let error_message = ''

  const signInSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential: UserCredential) => {
        signIn(userCredential.user)
        navigate('/profile');
    })
      .catch((error) => {
        console.log(error);
        error_message = error
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
      {error_message}
    </div>
  );
}

export default Login;
