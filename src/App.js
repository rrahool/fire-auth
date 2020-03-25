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
          photo: '',
          password: '',
          isValidName: false,
          isValidPass: false,
          error: ''
        }
        setUser(signedOutUser);
        console.log(res);
      })
      .catch(err => {
        console.log(err);
        console.log(err.message);
      })
    
  }

  const is_valid_email = email => /(.+)@(.+){2,}\.(.+){2,}/.test(email);
  const hasNumber = input =>  /\d/.test(input);

  const handleChange = e => {
    const newUserInfo = {
      ...user
    };
    // debugger;
    // perform validation
    let isValidName = true;
    let isValidPass = true;
    if(e.target.name === 'email'){
      isValidName = is_valid_email(e.target.value);
    }
    if(e.target.name === 'password'){
      isValidPass = e.target.value.length > 8 && hasNumber(e.target.value) ;
    }
    

    newUserInfo[e.target.name] = e.target.value;
    newUserInfo.isValidName = isValidName;
    newUserInfo.isValidPass = isValidPass;
    setUser(newUserInfo);
  }

  const createAccount = (event) => {  
    if(user.isValidName && user.isValidPass){
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then(res => {
        console.log(res);
        const createdUser = {...user};
        createdUser.isSignedIn = true;
        setUser(createdUser);
      })      
      .catch(err =>  {
        // Handle Errors here.
        console.log(err.message);
        const createdUser = {...user};
        createdUser.isSignedIn = false;
        createdUser.error = err.message;
        setUser(createdUser);
      })
    }
    else{
      console.log("Form is not valid", user);
    }
    event.preventDefault();
    event.target.reset();
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
        <form onSubmit={createAccount}>
          <input type="text" onBlur={handleChange} name="name" placeholder="Your Name" required/>
          <br/>
          <input type="text" onBlur={handleChange} name="email" placeholder="Your Email" required/>
          <br/>
          <input type="password" onBlur={handleChange} name="password" placeholder="Your Password" required/>
          <br/>
          <input type="submit" value="Create Account"/>
        </form>
        {
          user.error && <p style={{color:'red'}}>{user.error}</p>
        }
    </div>
  );
}

export default App;
