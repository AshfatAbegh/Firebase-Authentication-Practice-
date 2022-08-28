import './App.css';
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import firebaseConfig from './firebase.config';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, FacebookAuthProvider } from "firebase/auth";
import { useState } from 'react';

firebase.initializeApp(firebaseConfig);

function App() {
  const[newUser, setNewUser] = useState(false);
  const [user,setUser] = useState({
     isSignedIn: false,
     name: '', 
     email: '',
     password: '',
     photo: '',
     error:'',
     success: false
  });
  const provider = new GoogleAuthProvider();
  const fbProvider = new FacebookAuthProvider();

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
       const signedOutUser = {
        isSignedIn: false,
        name:'',
        email: '',
        photo: ''
      };
      setUser(signedOutUser);
    })
    .catch(err => {

    })
  }

  const handleFbSignIn = () => {
    const auth = getAuth();
    signInWithPopup(auth, fbProvider)
   .then((result) => {
    // The signed-in user info.
    const user = result.user;
    console.log('fb user after sign in', user);
    })

   .catch((error) => {
   
  });
}

  const handleBlur = (event) =>{
    let isFieldValid = true;
    if(event.target.name === 'email'){
      isFieldValid = /\S+@\S+\.\S+/.test(event.target.value);//Regular Expression
      }
    if(event.target.name === 'password'){
      const isPasswordValid = event.target.value.length > 6;
      const passwordHasNumber = /\d{1}/.test(event.target.value);//Regular Expression
      isFieldValid = isPasswordValid && passwordHasNumber;  
    }
    if(isFieldValid){
      const newUserInfo = {...user};
      newUserInfo[event.target.name] = event.target.value;
      setUser(newUserInfo);
    }
  }

  const handleSubmit = (event) =>{
     if(newUser && user.email && user.password){
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, user.email, user.password)
        .then(res => {
          const newUserInfo = {...user};
          newUserInfo.error = '';
          newUserInfo.success = true;
          setUser(newUserInfo);
          updateUserName(user.name);
          console.log('sign in user info', res.user);      
        })
        .catch(error => {
          const newUserInfo = {...user};
          newUserInfo.error = error.message;
          newUserInfo.success = false;
          setUser(newUserInfo);
        });
     }

     if(!newUser && user.email && user.password){
      const auth = getAuth();
      signInWithEmailAndPassword(auth, user.email, user.password)
        .then( res => {
          const newUserInfo = {...user};
          newUserInfo.error = '';
          newUserInfo.success = true;
          setUser(newUserInfo); 
         })
        .catch((error) => {
          const newUserInfo = {...user};
          newUserInfo.error = error.message;
          newUserInfo.success = false;
          setUser(newUserInfo);
        });
     }
     event.preventDefault();
  }

  const updateUserName = name =>{
    const auth = getAuth();
    updateProfile(auth.currentUser, {
    displayName: name, 
    })

  .then(() => {
      console.log('User Name Updated Successfully');
  })
  .catch((error) => {
    console.log(error);
  });
}

  return (
    <div className="App">
      {
        user.isSignedIn ? <button onClick={handleSignOut}>Sign Out</button> :
        <button onClick={handleSignIn}>Sign In</button> // if, else condition in one line 
      }
      <br/><br/>
      <button onClick = {handleFbSignIn}>Sign In using facebook</button>
      {
        user.isSignedIn && <div>
          <p>Welcome, {user.name}</p>
          <p>Your Email: {user.email}</p>
          <img src = {user.photo} alt=""></img>
        </div>
      }

      <h1>Our Own Authentication System:</h1>
      <input type = "Checkbox" onChange = {() => setNewUser(!newUser)}name="newUser" id=""/>
      <label htmlFor = "newUser">New User Sign Up</label>
      <br/><br/>
      <form onSubmit = {handleSubmit}>
      {newUser && <input type = "text" name="name"onBlur = {handleBlur} placeholder = "Enter your name" required/>}
      <br/><br/>
      <input type = "text" name="email" onBlur = {handleBlur} placeholder="Enter your email" required/>
      <br/><br/>
      <input type = "password" name="password" onBlur = {handleBlur} placeholder="Enter your password" required/>
      <br/><br/>
      <input type = "submit" value = {newUser ? 'Sign Up' : 'Sign In'}/> 
      </form>
      <p style  = {{color:'red'}}>{user.error}</p>
      {
        user.success && <p style  = {{color:'green'}}>User {newUser ? 'Created' : 'Logged In'} Successfully</p>    
      }    
     </div>
  );
}

export default App;
