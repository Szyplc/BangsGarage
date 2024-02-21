import { useState } from "react";
import Register from "./Register";
import Login from "./Login";
import backgroundAuth from "./../../../assets/background_auth.png"
import { UserCredential, signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../base";
import { signIn } from "../../Store/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../Store/store";
import { useNavigate } from "react-router-dom";
import { CurrentTheme } from "../../Store/themeSlice";
function Auth() {
  const [authorized, setAuthorized] = useState("register")
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate();
  const currentTheme = useSelector(CurrentTheme)

  const SignUpWithGoogle = async (e: any) => { 
    e.preventDefault();

    // Pobieranie lokalizacji przed wysłaniem danych
    /*let localization: number[] = [0, 0];
  
    await fetchLocation().then((coords) => {
      localization = coords  // [latitude, longitude]
    }).catch((error) => {
      console.error(error);
      localization = [0, 0]
    });*/

    try {
      signInWithPopup(auth, provider)
        .then((userCredential: UserCredential) => {
          dispatch(signIn(userCredential.user))
          navigate('/configuration');
        })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundImage: `url(${backgroundAuth})`, backgroundSize: "cover", position: "absolute" }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ marginTop: "20vh"}}>Bangs Garage</h1>
      </div>
      <div style={{ marginTop: "15vh", padding: '20px', borderRadius: '20px', marginLeft: "30px", marginRight: "30px" }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', paddingBottom: '20px' }}>
          <button onClick={() => {setAuthorized("login")}} style={{ backgroundColor: currentTheme.Primary, color: 'white', fontSize: '20px', 
          border: authorized === "login" ? '2px solid white' : "none" }}>Sign in</button>
          <button onClick={() => {setAuthorized("register")}} style={{ backgroundColor: currentTheme.Primary, border: authorized === "register" ? '2px solid white' : "none", 
          color: 'white', fontSize: '20px' }}>Sign up</button>
        </div>
        { authorized == 'register' ? <Register /> : <Login /> }
        
        <div style={{ display: "flex"}}>
        <button style={{ width: "50%", backgroundColor: '#0000FF', color: "white", padding: '10px', border: 'none', borderRadius: '5px' }}>Facebook</button>
        <button onClick={SignUpWithGoogle} style={{ width: "50%", backgroundColor: '#FF0000', padding: '10px', border: 'none', borderRadius: '5px' }}>Google</button>
        </div>
      </div>
    </div>
  );
}

export default Auth;
