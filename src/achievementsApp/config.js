import firebase from "firebase";

export const APP_SETTING = {
  DrawerWidth: 250
};

// Initialize Firebase
const config = {
    apiKey: "AIzaSyA232bBlzWT0fl3ST_KVC3Aay41yTMz5vM",
    authDomain: "achievements-dev.firebaseapp.com",
    databaseURL: "https://achievements-dev.firebaseio.com",
    projectId: "achievements-dev",
    storageBucket: "achievements-dev.appspot.com",
    messagingSenderId: "479020625755"
};
firebase.initializeApp(config);

export const authProvider = new firebase.auth.GoogleAuthProvider();