import  {initializeApp} from 'firebase/app';
import {getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut} from 'firebase/auth';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
}

const App = initializeApp(firebaseConfig);
const auth = getAuth(App);

const FirebaseAuth = {
    auth,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    googleProvider: new GoogleAuthProvider(),
}

export {FirebaseAuth};