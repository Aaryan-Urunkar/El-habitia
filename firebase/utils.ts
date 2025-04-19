import { getFirestore, collection, getDocs, limit, query } from 'firebase/firestore';
import { app } from './config';

// Function to check if Firebase is connected
export const checkFirebaseConnection = async (): Promise<{
  isConnected: boolean;
  message: string;
}> => {
  try {
    const db = getFirestore(app);
    // Try to fetch a single document from any collection
    // This is just a connectivity test
    const testQuery = query(collection(db, 'test'), limit(1));
    await getDocs(testQuery);
    
    return {
      isConnected: true,
      message: 'Firebase connection successful!'
    };
  } catch (error) {
    console.error('Firebase connection error:', error);
    return {
      isConnected: false,
      message: `Firebase connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};
