import { signInWithEmailAndPassword, UserCredential } from 'firebase/auth';
import React, { useState } from 'react';
import "./Login.css"
import { useNavigate } from "react-router-dom";
import { auth } from '../../base';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../Store/store';
import { signIn } from '../../Store/authSlice';
import { CurrentTheme } from '../../Store/themeSlice';
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const currentTheme = useSelector(CurrentTheme)

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
        console.log(error.message)
        if(error.message == "Firebase: Error (auth/invalid-email).")
          setErrorMessage("Podany adres email jest nieprawidłowy.")
        else if(error.message == "Firebase: Error (auth/user-not-found).")
          setErrorMessage("Nie znaleziono użytkownika odpowiadającego podanemu adresowi email.")
        else if(error.message == "Firebase: Error (auth/wrong-password).")
          setErrorMessage("Podane hasło jest nieprawidłowe dla danego użytkownika.")
        else
          setErrorMessage("Błąd logowania spróbuj ponownie.")
      });
  };

  return (
    <>
      <form onSubmit={signInSubmit}>
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" style={{ marginBottom: '10px' }} />
        <input type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Password" style={{ marginBottom: '20px' }} />
        <button type="submit" style={{ width: "-webkit-fill-available", backgroundColor: currentTheme.SecondAccent, padding: '10px', border: 'none', borderRadius: '5px', marginBottom: '10px' }}>Sign in</button>
      </form>
      <div style={{ color: currentTheme.White }}>{errorMessage}</div>
    </>
  );
}

export default Login;
