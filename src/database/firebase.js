// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // Add Auth
import { collection, getFirestore } from "firebase/firestore"; // Add Firestore
import { getDatabase } from "firebase/database"; // Add Realtime Database
import { getStorage } from "firebase/storage"; // Add Storage
import { query, where, getDocs } from "firebase/firestore";

// Web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDHrzAqShMSpWwCXkeaCzpdGvaS8U6I5I0",
    authDomain: "marco-pd.firebaseapp.com",
    databaseURL: "https://marco-pd-default-rtdb.firebaseio.com",
    projectId: "marco-pd",
    storageBucket: "marco-pd.appspot.com",
    messagingSenderId: "858738069219",
    appId: "1:858738069219:web:3f73482db29393b96bffd6",
    measurementId: "G-6TRL005GWZ"
  };
  
// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(firebaseApp); // Initialize Auth 
const firestore = getFirestore(firebaseApp); // Initialize Firestore
const database = getDatabase(firebaseApp); // Initialize Realtime Database
const storage = getStorage(firebaseApp); // Initialize Storage
const analytics = getAnalytics(firebaseApp); // Initialize Analytics


export { auth, firestore, database, storage, analytics, firebaseApp };