import { GoogleAuthProvider, UserCredential, createUserWithEmailAndPassword, getRedirectResult, signInWithEmailAndPassword, signInWithPopup, signInWithRedirect } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, provider } from "../../base";
import "./Register.css";
import axios from "axios";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../Store/store";
import { signIn } from "../../Store/authSlice";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>()

  // Funkcja do pobierania lokalizacji użytkownika
  const fetchLocation = (): Promise<number[]> => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            resolve([latitude, longitude]);
          },
          (error) => {
            console.log("Błąd pobierania lokalizacji:", error.message);
            reject(error);  // Możesz zdecydować, czy chcesz odrzucić obietnicę w przypadku błędu
          }
        );
      } else {
        console.log("Przeglądarka nie obsługuje Geolokalizacji.");
        reject("Geolokalizacja nie jest obsługiwana");  // Odrzucenie obietnicy
      }
    });
  };

  const signUp = async (e: any) => {
    e.preventDefault();

    // Pobieranie lokalizacji przed wysłaniem danych
    let localization: number[] = [0, 0];
  
    await fetchLocation().then((coords) => {
      localization = coords  // [latitude, longitude]
    }).catch((error) => {
      console.error(error);
      localization = [0, 0]
    });

    let username = email.split("@")[0] ?? ""

    await createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential: UserCredential) => {
        await axios.post("http://localhost:3000/register", {
          userCredential: userCredential,
          username: username,
          localization: localization
        }, {
          headers: {
            "Content-Type": "application/json",
          }
        })
          .then(async () => {
            await signInWithEmailAndPassword(auth, email, password)
              .then((userCredential: UserCredential) => {
                dispatch(signIn(userCredential.user))
                navigate('/configuration');
              })
            .catch((error) => {
              console.log("Błąd logowania:", error);
            });
          })
          .catch((error) => {
            console.log("Błąd rejestracji:", error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };


  return ( 
  <>
    <form onSubmit={signUp}>
      <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" style={{ marginBottom: '10px' }} />
      <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" style={{ marginBottom: '10px' }} />
      <input value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} type="password" placeholder="Repeat Password" style={{ marginBottom: '20px' }} />
      <button type="submit" style={{ width: "-webkit-fill-available", backgroundColor: '#FFD700', padding: '10px', border: 'none', borderRadius: '5px', marginBottom: '10px' }}>Sign up</button>
    </form>
  </>
  );
}

export default Register;

