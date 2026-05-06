// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAcluLyn7ZZoGO7KacQZ8KAIr8Z46IJ3es",
  authDomain: "asymmetri-careers.firebaseapp.com",
  projectId: "asymmetri-careers",
  storageBucket: "asymmetri-careers.firebasestorage.app",
  messagingSenderId: "972795479277",
  appId: "1:972795479277:web:08f750c490eeead38178e4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
