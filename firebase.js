import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyAcluLyn7ZZoGO7KacQZ8KAIr8Z46IJ3es",
  authDomain: "asymmetri-careers.firebaseapp.com",
  projectId: "asymmetri-careers",
  storageBucket: "asymmetri-careers.firebasestorage.app",
  messagingSenderId: "972795479277",
  appId: "1:972795479277:web:08f750c490eeead38178e4",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
