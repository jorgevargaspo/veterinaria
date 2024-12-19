
// firebase.js
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCk5P4PhpyzhXzqwns5chaE_AphpRMOGiI",
  authDomain: "notificacion-react-e2227.firebaseapp.com",
  projectId: "notificacion-react-e2227",
  storageBucket: "notificacion-react-e2227.appspot.com",
  messagingSenderId: "7274954644",
  appId: "1:7274954644:web:3e4083286fdb672ad1d981",
  measurementId: "G-VB3C96H5MH"
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);