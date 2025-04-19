import { useState } from 'react';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithCredential,
  signOut,
  getAuth
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { firestore } from '@/firebase/config';

export function useAuth() {
  const { setUser, setLoading, setError, logout: storeLogout } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const auth = getAuth();

  const login = async (email: string, password: string) => {
    setIsSubmitting(true);
    setLoading(true);
    setError(null);
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const { user: firebaseUser } = userCredential;
      
      // Get user data from Firestore
      const userDoc = await getDoc(doc(firestore, 'users', firebaseUser.uid));
      const userData = userDoc.data();
      
      setUser({
        id: firebaseUser.uid,
        email: firebaseUser.email!,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        personality: userData?.personality,
      });
      
      // Navigate based on whether personality is set
      if (userData?.personality) {
        router.replace('/(tabs)/dashboard');
      } else {
        router.replace('/(auth)/personality');
      }
    } catch (error: any) {
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };
  
  const signup = async (email: string, password: string) => {
    setIsSubmitting(true);
    setLoading(true);
    setError(null);
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const { user: firebaseUser } = userCredential;
      
      // Create user document in Firestore
      await setDoc(doc(firestore, 'users', firebaseUser.uid), {
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        createdAt: new Date(),
      });
      
      setUser({
        id: firebaseUser.uid,
        email: firebaseUser.email!,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
      });
      
      // Go to personality quiz
      router.replace('/(auth)/personality');
    } catch (error: any) {
      setError(error.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };
  
  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      storeLogout();
      router.replace('/(auth)/login');
    } catch (error: any) {
      setError(error.message || 'Logout failed.');
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async (idToken: string) => {
    setIsSubmitting(true);
    setLoading(true);
    setError(null);
    
    try {
      const credential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(auth, credential);
      const { user: firebaseUser } = userCredential;
      
      // Check if user exists in Firestore
      const userDoc = await getDoc(doc(firestore, 'users', firebaseUser.uid));
      
      if (!userDoc.exists()) {
        // Create new user document
        await setDoc(doc(firestore, 'users', firebaseUser.uid), {
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          createdAt: new Date(),
        });
        
        // New user - go to personality quiz
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email!,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        });
        
        router.replace('/(auth)/personality');
      } else {
        // Existing user - check if personality is set
        const userData = userDoc.data();
        
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email!,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          personality: userData?.personality,
        });
        
        if (userData?.personality) {
          router.replace('/(tabs)/dashboard');
        } else {
          router.replace('/(auth)/personality');
        }
      }
    } catch (error: any) {
      setError(error.message || 'Google sign in failed. Please try again.');
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  return {
    login,
    signup,
    logout,
    signInWithGoogle,
    isSubmitting,
  };
}
