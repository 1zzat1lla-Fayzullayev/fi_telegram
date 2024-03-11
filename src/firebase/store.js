import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDJ2zMZb8mO2GTrnYqZ8k7foO7HlWBFEPg",
  authDomain: "fimessage.firebaseapp.com",
  projectId: "fimessage",
  storageBucket: "fimessage.appspot.com",
  messagingSenderId: "841108468797",
  appId: "1:841108468797:web:1d692d9ae370d9dfde2654",
  measurementId: "G-8Z1KG1GT33",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, app };
