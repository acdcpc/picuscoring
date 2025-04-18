const { initializeApp } = require('firebase/app');
const { getAuth, signInAnonymously } = require('firebase/auth');
const { getFirestore } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyANUUuJVivJbHqLvkd223pBLzPN0wNP-xU",
  authDomain: "picu-app-score.firebaseapp.com",
  projectId: "picu-app-score",
  storageBucket: "picu-app-score.firebasestorage.app",
  messagingSenderId: "645088343970",
  appId: "1:645088343970:web:04a51ab6a687b4887624fb",
  measurementId: "G-Y6CPH066RX"
};

try {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  // Sign in anonymously
  signInAnonymously(auth)
    .then(() => console.log('Signed in anonymously successfully'))
    .catch(error => {
      console.error('Anonymous auth error:', error.code, error.message);
      throw error;
    });

  module.exports = { auth, db };
} catch (error) {
  console.error('Firebase initialization error:', error.code, error.message);
}