import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

firebase.initializeApp(firebaseConfig);

function App() {
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    photo: ''
  })

  const provider = new firebase.auth.GoogleAuthProvider();

  const handleSignIn = () => {
    // console.log('sign in clicked');
    firebase.auth().signInWithPopup(provider)
      .then(res => {
        const {displayName, email, photoURL} = res.user;
        const signedInUser = {
          isSignedIn: true,
          name: displayName,
          email: email,
          photo: photoURL
        }
        setUser(signedInUser);
        // console.log(displayName, email, photoURL);
      })
      .catch(err => {
        console.log(err);
        console.log(err.message);
      })
  }

  const handleSignOut = () => {
    firebase.auth().signOut()
      .then(res => {
        const signedOutUser = {
          isSignedIn: false,
          name: '',
          email: '',
          photo: ''
        }
        setUser(signedOutUser);
        console.log(res);
      })
      .catch(err => {
        console.log(err);
        console.log(err.message);
      })
    
  }

  const handleChange = e => {
    const newUserInfo = {
      ...user
    };
    // perform validation
    newUserInfo[e.target.name] =e.target.value;
    setUser(newUserInfo);
  }

  const createAccount = () => {
    //
    console.log(user.email, user.password);
    
  }

  return (
    <div className="App">
        {
          user.isSignedIn ? <button onClick={handleSignOut}>Sign Out</button> : <button onClick={handleSignIn}>Sign in</button>
        }
        {
          user.isSignedIn && <div>
              <p>Welcome, {user.name}</p>
              <p>Your Email: {user.email}</p>
              <img src={user.photo} alt=""/>
          </div>
        }
        <h1>User Authentication</h1>
        <input type="text" onBlur={handleChange} name="email" placeholder="Your Email"/>
        <br/>
        <input type="password" onBlur={handleChange} name="password" placeholder="Your Password"/>
        <br/>
        <button onClick={createAccount}>Create Account</button>
    </div>
  );
}

export default App;
