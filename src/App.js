import React from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

firebase.initializeApp(firebaseConfig);

function App() {

  const provider = new firebase.auth.GoogleAuthProvider();

  const handleSignIn = () => {
    // console.log('sign in clicked');
    firebase.auth().signInWithPopup(provider)
      .then(res => {
        const {displayName, email, photoURL} = res.user;
        console.log(displayName, email, photoURL);
      })
  }

  return (
    <div className="App">
        <button onClick={handleSignIn}>Sign in</button>
    </div>
  );
}

export default App;
