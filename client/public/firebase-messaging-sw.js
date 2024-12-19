// firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/11.0.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/11.0.1/firebase-messaging-compat.js");

const firebaseConfig = {
  apiKey: "AIzaSyCk5P4PhpyzhXzqwns5chaE_AphpRMOGiI",
  authDomain: "notificacion-react-e2227.firebaseapp.com",
  projectId: "notificacion-react-e2227",
  storageBucket: "notificacion-react-e2227.appspot.com",
  messagingSenderId: "7274954644",
  appId: "1:7274954644:web:3e4083286fdb672ad1d981",
  measurementId: "G-VB3C96H5MH"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});