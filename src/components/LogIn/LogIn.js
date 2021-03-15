

import { useContext, useState } from 'react';
import { userContext } from "../../App";
import { useHistory, useLocation } from "react-router";
import { handleGoogleSignIn, handleSignOut, handleFbSignIn, initializeLogInFramework, createUserWithEmailPassword, signInWithEmailAndPassword } from './LogInManager';



function LogIn() {
  const [newUser, setNewUser] = useState(false)
  const [user, setUser] = useState({
    isSignIn: false,
    name: '',
    email: '',
    password: '',
    photo: '',
    error: '',
    success: ''
  })

  initializeLogInFramework();

  const [loggedInUser, setLoggedInUser] = useContext(userContext)
  let history = useHistory()
  let location = useLocation()
  let { from } = location.state || { from: { pathname: "/" } };

  
  const googleSignIn = () => {
      handleGoogleSignIn()
      .then(res => {
        handleResponse(res, true)
      })
  }
  
  const signOut = () => {
      handleSignOut()
      .then(res => {
        handleResponse(res, false)
      })
  }

  const fbSignIn = () => {
    handleFbSignIn()
    .then(res => {
        handleResponse(res, true)
    })
  }


  const handleResponse = (res, redirect) => {
    setUser(res)
    setLoggedInUser(res)
    if(redirect){
        history.replace(from);
    }
  }


  const handleBlur = (e) =>{
    // console.log(e.target.name, e.target.value)
    let isFieldValid = true;
    if(e.target.name === "email"){
      // const isEmailValid = /\S+@\S+\.\S+/.test(e.target.value)
      isFieldValid = /\S+@\S+\.\S+/.test(e.target.value)
      // console.log(isEmailValid)
    }
    if(e.target.name === "password"){
      const isPasswordValid = e.target.value.length > 6
      const passwordHasNumber = /\d{1,}/.test(e.target.value)
      isFieldValid = (isPasswordValid && passwordHasNumber)
      // console.log(isPasswordValid && passwordHasNumber)
    }
    if(isFieldValid){
      //[...cart, newCart]
      const newUserInfo = {...user} //isSignIn er value gula carli bracket er modde ace tai
      newUserInfo[e.target.name] = e.target.value   //add hoye update hocce
      setUser(newUserInfo)
    }
  }
  const handleSubmit = (e) => {
    // console.log(user.email, user.password)
    if(newUser && user.email && user.password){
      createUserWithEmailPassword(user.name, user.email, user.password)
      .then(res => {
        handleResponse(res, true)
      })
    }
    if(!newUser && user.email && user.password){
      signInWithEmailAndPassword(user.email, user.password)
      .then(res => {
        handleResponse(res, true)
      })
    }
    
    e.preventDefault();
  }

 



  return (
    <div style={{textAlign: 'center'}}>
      {
        user.isSignIn ? <button onClick={signOut}>Sign Out</button> : <button onClick={googleSignIn}>Sign in</button>
      }
      <br/>
      <button onClick={fbSignIn}> LogIn using Facebook</button>
      {
        user.isSignIn && <div>
          <p>Welcome, {user.name}</p>
          <p>Email: {user.email}</p>
          <img src={user.photo} alt="photo" />
        </div>
      }
      <h1>Our Own Authentication</h1>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>Password: {user.password}</p>
      <input type="checkbox" onChange={() => setNewUser(!newUser)} name="newUser" id=""/>
      <label htmlFor="newUser">New User Sign Up</label>
      <form onSubmit={handleSubmit}>
      { newUser && <input type="text" name="name" onBlur={handleBlur} placeholder="Your Name" />}
        <br/>
        <input type="text" name="email" onBlur={handleBlur} placeholder="Your Email Address" required />
        <br />
        <input type="password" name="password" onBlur={handleBlur} placeholder="Your Password" required />
        <br />
        <input type="submit" value="Submit"/>
      </form>
      <p style={{color: "red"}}>{user.error}</p>
      {
        user.success && <p style={{color: "green"}}>User { newUser ? 'created' : 'Logged In' } Successfully</p>
      }
    </div>
  );
}

export default LogIn;
