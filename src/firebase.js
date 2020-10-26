import firebase from  "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyDTqQJ04172Qt4L0fbO4mwWTjlQn2Ux9p4",
  authDomain: "instagram-clone-react-73eb7.firebaseapp.com",
  databaseURL: "https://instagram-clone-react-73eb7.firebaseio.com",
  projectId: "instagram-clone-react-73eb7",
  storageBucket: "instagram-clone-react-73eb7.appspot.com",
  messagingSenderId: "361046028118",
  appId: "1:361046028118:web:4499f38ae7b7e77bf870f7",
  measurementId: "G-ZL7LZZ8GQG",
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage};
