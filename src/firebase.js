import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyANUUuJVivJbHqLvkd223pBLzPN0wNP-xU",
  authDomain: "picu-app-score.firebaseapp.com",
  projectId: "picu-app-score",
  storageBucket: "picu-app-score.firebasestorage.app",
  messagingSenderId: "645088343970",
  appId: "1:645088343970:web:04a51ab6a687b4887624fb",
  measurementId: "G-Y6CPH066RX"
};

let auth, db;

try {
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);

  // Sign in anonymously
  signInAnonymously(auth)
    .then(() => console.log('Signed in anonymously successfully'))
    .catch(error => {
      console.error('Anonymous auth error:', error.code, error.message);
      throw error;
    });
} catch (error) {
  console.error('Firebase initialization error:', error.code, error.message);
}

export { auth, db };