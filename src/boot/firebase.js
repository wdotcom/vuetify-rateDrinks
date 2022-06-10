// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { LocalStorage } from "quasar";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
//import { getDatabase, ref, set } from "firebase/database";

import { getAuth, onAuthStateChanged } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD5qBru4sZviqx6ecuBX7g3_-5zzh3f3Ho",
  authDomain: "rate-drinks.firebaseapp.com",
  projectId: "rate-drinks",
  storageBucket: "rate-drinks.appspot.com",
  messagingSenderId: "1078131254087",
  appId: "1:1078131254087:web:3d2ceea6e683ba73702262",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const database = getDatabase(app);
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth();

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    const uid = user.uid;
    try {
      LocalStorage.set("storedID", uid);
      LocalStorage.set("storedName", user.displayName);
      let value = LocalStorage.getItem("storedName");
    } catch (e) {
      console.log("localStore error ", e);
      // data wasn't successfully saved due to
      // a Web Storage API error
    }

    // ...
  } else {
    // User is signed out

    LocalStorage.set("storedID", "");
    LocalStorage.set("storedName", "");
    // ...
  }
});

export { auth, db };
