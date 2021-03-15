import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config'

export const initializeLogInFramework = () => {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
      }else {
        firebase.app(); // if already initialized, use that one
      }
}

export const handleGoogleSignIn = () => {
    const googleProvider = new firebase.auth.GoogleAuthProvider();
    return firebase.auth()
      .signInWithPopup(googleProvider)
      .then((result) => {
        const { displayName, email, photoURL } = result.user
        const signInUser = {
          isSignIn: true,
          name: displayName,
          email: email,
          photo: photoURL,
          success: true
        }
        return signInUser
        // console.log(displayName, email, photoURL)
      })
      .catch(err => {
        console.log(err)
        console.log(err.message)
      })
  }

 export const handleFbSignIn = () => {
    const fbProvider = new firebase.auth.FacebookAuthProvider();
   return firebase
  .auth()
  .signInWithPopup(fbProvider)
  .then((result) => {
    /** @type {firebase.auth.OAuthCredential} */
    var credential = result.credential;

    // The signed-in user info.
    var user = result.user;
    user.success = true
    return user
    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    var accessToken = credential.accessToken;
    // console.log('fb user after sign in', user)

    // ...
  })
  .catch((error) => {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;

    // ...
  });
  }


 export const handleSignOut = () => {
    return firebase.auth().signOut()
      .then(res => {
        const signOutUser = {
          isSignIn: false,
          name: '',
          email: '',
          photo: '',
          error: '',
          success: false
        }
        return signOutUser
      })
      .catch(err => {
        console.log(err)
      })
    console.log("sign out")
  }

  export const createUserWithEmailPassword = (name, email, password) => {
   return firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(res => {
      // Signed in 
      const newUserInfo = res.user 
      newUserInfo.error = ''
      newUserInfo.success = true
      updateUserName(name)
      return newUserInfo
    })
    .catch(error => {
      const newUserInfo = {};
      newUserInfo.error = error.message
      newUserInfo.success = false
      return newUserInfo
    });
  }

  export const signInWithEmailAndPassword = (email, password) => {
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then( res => {
      const newUserInfo = res.user 
      newUserInfo.error = ''
      newUserInfo.success = true
     return newUserInfo
    })
    .catch(error => {
      const newUserInfo = {};
      newUserInfo.error = error.message
      newUserInfo.success = false
      return newUserInfo
    });
  }

  const updateUserName = name => {
    const user = firebase.auth().currentUser;

      user.updateProfile({
        displayName: name
      }).then(function() {
        console.log('update successfully')
      }).catch(function(error) {
        console.log(error)
      });
  }