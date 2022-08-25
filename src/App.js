import './App.css';
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import firebaseConfig from './firebase.config';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { useState } from 'react';

firebase.initializeApp(firebaseConfig);

function App() {
  const [user,setUser] = useState({
     isSignedIn: false,
     name: '', 
     email: '',
     photo: ''
  });
  const provider = new GoogleAuthProvider();

  //Sign In Function
  const handleSignIn = () => {
    const auth = getAuth();
    signInWithPopup(auth, provider)
    .then(res => {
      const{displayName, email, photoURL} = res.user;
      const signedInUser  =  {
        isSignedIn: true,
        name: displayName,
        email: email,
        photo: photoURL
      }; 
      setUser(signedInUser);
      console.log(displayName, email, photoURL);
      // console.log(res);
   })
     .catch(err => {
       console.log(err);
       console.log(err.message);
     }) 
  }

  //Sign Out Function
  const handleSignOut = () =>{
    const auth = getAuth();
    signOut(auth)
    .then(res => {
       const signedOutUser = 
      {isSignedIn: false,
        name:'',
        email: '',
        photo: ''
      };
      setUser(signedOutUser);
      console.log(res);
    })
    .catch(err => {

    })
  }
  
  return (
    <div className="App">
      {
        user.isSignedIn ? <button onClick={handleSignOut}>Sign Out</button> :
        <button onClick={handleSignIn}>Sign In</button> // if, else condition in one line 
      }
      {
        user.isSignedIn && <div>
          <p>Welcome, {user.name}</p>
          <p>Your Email: {user.email}</p>
          <img src = {user.photo} alt=""></img>
        </div>
      }
    </div>
  );
}

export default App;
