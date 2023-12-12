import { User, UserCredential, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../base";
import "./Register.css";
import { AuthContext } from "./AuthContext";
import axios from "axios";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();
  const { signIn } = useContext(AuthContext);

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
    await createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        await axios.post("http://localhost:3000/register", {
          userCredential: userCredential,
          username: username,
          localization: localization
        }, {
          headers: {
            "Content-Type": "application/json",
          }
        })
          .then(async (response: any) => {
            console.log(response.data);
            await signInWithEmailAndPassword(auth, email, password)
              .then((userCredential: UserCredential) => {
                signIn(userCredential.user)
                navigate('/configuration');
              })
            .catch((error) => {
              console.log("Błąd logowania:", error);
            });
          })
          .catch((error: string) => {
            console.log("Błąd rejestracji:", error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="sign-Up-container">
      <form onSubmit={signUp} className="register-form">
        <h1>Register</h1>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="register-input"
        />

        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="register-input"
        />

        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="register-input"
        />

        <button type="submit" className="register-button">
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;