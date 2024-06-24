import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDQHki0guuO4AGtaXexgMUlefTzbi_XeKs",
  authDomain: "e-clone-44dec.firebaseapp.com",
  projectId: "e-clone-44dec",
  storageBucket: "e-clone-44dec.appspot.com",
  messagingSenderId: "113153580670",
  appId: "1:113153580670:web:b524a43abfc27ce63e422f",
  measurementId: "G-VT0NTZ9KKR"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebase.auth();

export {db, auth};