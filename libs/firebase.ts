// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCLmJp2kUr7wV_WzhJHdKgABgLWBKTOGkE",
  authDomain: "valvi-shop.firebaseapp.com",
  projectId: "valvi-shop",
  storageBucket: "valvi-shop.appspot.com",
  messagingSenderId: "54825501603",
  appId: "1:54825501603:web:aa075aed4ef646df695016",
  measurementId: "G-2EXNQJVH6B"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebaseApp);

export default firebaseApp