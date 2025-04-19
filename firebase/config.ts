import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
// These values are automatically provided by the google-services.json file
const firebaseConfig = {
  apiKey: "AIzaSyAJ-v8vDjIlJH9N27GFi8bpMu3TDsn26ss",
  projectId: "habitia-c26b6",
  storageBucket: "habitia-c26b6.firebasestorage.app",
  appId: "1:168393422017:android:5e70b85cf7414b5bb95040",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

export { app, auth, firestore, storage };
