
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyANUUuJVivJbHqLvkd223pBLzPN0wNP-xU",
  authDomain: "picu-app-score.firebaseapp.com",
  projectId: "picu-app-score",
  storageBucket: "picu-app-score.firebasestorage.app",
  messagingSenderId: "645088343970",
  appId: "1:645088343970:web:04a51ab6a687b4887624fb",
  measurementId: "G-Y6CPH066RX"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);