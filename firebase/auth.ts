import { 
  getAuth, 
  createUserWithEmailAndPassword as firebaseCreateUser, 
  signInWithEmailAndPassword as firebaseSignIn,
  signInWithCredential as firebaseSignInWithCredential,
  GoogleAuthProvider,
  UserCredential,
  AuthCredential,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { app } from './config';

// Initialize Firebase Auth
export const auth = getAuth(app);

/**
 * Creates a new user with email and password
 * @param email User's email address
 * @param password User's password
 * @returns Firebase UserCredential
 */
export const createUserWithEmailAndPassword = (
  email: string, 
  password: string
): Promise<UserCredential> => {
  return firebaseCreateUser(auth, email, password);
};

/**
 * Signs in an existing user with email and password
 * @param email User's email address
 * @param password User's password
 * @returns Firebase UserCredential
 */
export const signInWithEmailAndPassword = (
  email: string, 
  password: string
): Promise<UserCredential> => {
  return firebaseSignIn(auth, email, password);
};

/**
 * Signs in a user with a credential (e.g., Google)
 * @param credential Auth credential
 * @returns Firebase UserCredential
 */
export const signInWithCredential = (
  credential: AuthCredential
): Promise<UserCredential> => {
  return firebaseSignInWithCredential(auth, credential);
};

/**
 * Creates a Google credential from ID token
 * @param idToken Google ID token
 * @returns AuthCredential
 */
export const createGoogleCredential = (idToken: string): AuthCredential => {
  return GoogleAuthProvider.credential(idToken);
};

/**
 * Signs out the current user
 * @returns Promise that resolves when sign-out is complete
 */
export const signOut = (): Promise<void> => {
  return firebaseSignOut(auth);
};

// Export the provider for direct use if needed
export { GoogleAuthProvider };
