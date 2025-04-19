import { collection, doc, setDoc, getDoc, getDocs, query, where, orderBy, limit, serverTimestamp, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { firestore } from './config';
import { User, Habit, HabitLog, Post, Comment, AdviceSession, Message, VoiceChat, ScheduleEntry, AnalyticsEvent } from './models';

// =========================
// User Functions
// =========================

export const createUser = async (userId: string, userData: Omit<User, 'createdAt'>) => {
  try {
    const userWithTimestamp = {
      ...userData,
      createdAt: serverTimestamp(),
    };
    
    await setDoc(doc(firestore, 'users', userId), userWithTimestamp);
    return { success: true };
  } catch (error) {
    console.error('Error creating user:', error);
    return { success: false, error };
  }
};

export const getUser = async (userId: string) => {
  try {
    const userDoc = await getDoc(doc(firestore, 'users', userId));
    if (userDoc.exists()) {
      return { success: true, data: userDoc.data() as User };
    } else {
      return { success: false, error: 'User not found' };
    }
  } catch (error) {
    console.error('Error getting user:', error);
    return { success: false, error };
  }
};

export const updateUser = async (userId: string, userData: Partial<User>) => {
  try {
    await updateDoc(doc(firestore, 'users', userId), userData);
    return { success: true };
  } catch (error) {
    console.error('Error updating user:', error);
    return { success: false, error };
  }
};

// =========================
// Habit Functions
// =========================

export const createHabit = async (habitData: Omit<Habit, 'createdAt'>) => {
  try {
    const habitWithTimestamp = {
      ...habitData,
      createdAt: serverTimestamp(),
    };
    
    const docRef = await addDoc(collection(firestore, 'habits'), habitWithTimestamp);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating habit:', error);
    return { success: false, error };
  }
};

export const getUserHabits = async (userId: string) => {
  try {
    const habitsQuery = query(
      collection(firestore, 'habits'), 
      where('ownerId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(habitsQuery);
    const habits: Array<Habit & { id: string }> = [];
    
    querySnapshot.forEach((doc) => {
      habits.push({ id: doc.id, ...doc.data() as Habit });
    });
    
    return { success: true, data: habits };
  } catch (error) {
    console.error('Error getting user habits:', error);
    return { success: false, error };
  }
};

export const logHabitCompletion = async (habitId: string, date: string, completed: boolean) => {
  try {
    await setDoc(doc(firestore, 'habits', habitId, 'logs', date), {
      completed,
      timestamp: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error logging habit completion:', error);
    return { success: false, error };
  }
};

export const getHabitLogs = async (habitId: string, days: number = 30) => {
  try {
    const logsQuery = query(
      collection(firestore, 'habits', habitId, 'logs'),
      orderBy('timestamp', 'desc'),
      limit(days)
    );
    
    const querySnapshot = await getDocs(logsQuery);
    const logs: Record<string, HabitLog> = {};
    
    querySnapshot.forEach((doc) => {
      logs[doc.id] = doc.data() as HabitLog;
    });
    
    return { success: true, data: logs };
  } catch (error) {
    console.error('Error getting habit logs:', error);
    return { success: false, error };
  }
};

// =========================
// Community Functions
// =========================

export const createPost = async (postData: Omit<Post, 'createdAt'>) => {
  try {
    const postWithTimestamp = {
      ...postData,
      createdAt: serverTimestamp(),
    };
    
    const docRef = await addDoc(collection(firestore, 'posts'), postWithTimestamp);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating post:', error);
    return { success: false, error };
  }
};

export const getPosts = async (modeTag?: 'growth' | 'action', postLimit: number = 20) => {
  try {
    let postsQuery;
    
    if (modeTag) {
      postsQuery = query(
        collection(firestore, 'posts'),
        where('modeTag', '==', modeTag),
        orderBy('createdAt', 'desc'),
        limit(postLimit)
      );
    } else {
      postsQuery = query(
        collection(firestore, 'posts'),
        orderBy('createdAt', 'desc'),
        limit(postLimit)
      );
    }
    
    const querySnapshot = await getDocs(postsQuery);
    const posts: Array<Post & { id: string }> = [];
    
    querySnapshot.forEach((doc) => {
      posts.push({ id: doc.id, ...doc.data() as Post });
    });
    
    return { success: true, data: posts };
  } catch (error) {
    console.error('Error getting posts:', error);
    return { success: false, error };
  }
};

export const addComment = async (postId: string, commentData: Omit<Comment, 'createdAt'>) => {
  try {
    const commentWithTimestamp = {
      ...commentData,
      createdAt: serverTimestamp(),
    };
    
    const docRef = await addDoc(
      collection(firestore, 'posts', postId, 'comments'),
      commentWithTimestamp
    );
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error adding comment:', error);
    return { success: false, error };
  }
};

export const getComments = async (postId: string) => {
  try {
    const commentsQuery = query(
      collection(firestore, 'posts', postId, 'comments'),
      orderBy('createdAt', 'asc')
    );
    
    const querySnapshot = await getDocs(commentsQuery);
    const comments: Array<Comment & { id: string }> = [];
    
    querySnapshot.forEach((doc) => {
      comments.push({ id: doc.id, ...doc.data() as Comment });
    });
    
    return { success: true, data: comments };
  } catch (error) {
    console.error('Error getting comments:', error);
    return { success: false, error };
  }
};

// =========================
// Advice Session Functions
// =========================

export const createAdviceSession = async (sessionData: Omit<AdviceSession, 'startedAt'>) => {
  try {
    const sessionWithTimestamp = {
      ...sessionData,
      startedAt: serverTimestamp(),
    };
    
    const docRef = await addDoc(collection(firestore, 'adviceSessions'), sessionWithTimestamp);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating advice session:', error);
    return { success: false, error };
  }
};

export const addMessage = async (sessionId: string, messageData: Omit<Message, 'createdAt'>) => {
  try {
    const messageWithTimestamp = {
      ...messageData,
      createdAt: serverTimestamp(),
    };
    
    const docRef = await addDoc(
      collection(firestore, 'adviceSessions', sessionId, 'messages'),
      messageWithTimestamp
    );
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error adding message:', error);
    return { success: false, error };
  }
};

export const getMessages = async (sessionId: string) => {
  try {
    const messagesQuery = query(
      collection(firestore, 'adviceSessions', sessionId, 'messages'),
      orderBy('createdAt', 'asc')
    );
    
    const querySnapshot = await getDocs(messagesQuery);
    const messages: Array<Message & { id: string }> = [];
    
    querySnapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() as Message });
    });
    
    return { success: true, data: messages };
  } catch (error) {
    console.error('Error getting messages:', error);
    return { success: false, error };
  }
};

// =========================
// Analytics Functions
// =========================

export const logAnalyticsEvent = async (eventData: Omit<AnalyticsEvent, 'timestamp'>) => {
  try {
    const eventWithTimestamp = {
      ...eventData,
      timestamp: serverTimestamp(),
    };
    
    await addDoc(collection(firestore, 'analytics'), eventWithTimestamp);
    return { success: true };
  } catch (error) {
    console.error('Error logging analytics event:', error);
    return { success: false, error };
  }
};

// =========================
// Schedule Functions
// =========================

export const createScheduleEntry = async (scheduleData: Omit<ScheduleEntry, 'status'>) => {
  try {
    const scheduleWithDefaults = {
      ...scheduleData,
      status: 'pending',
    };
    
    const docRef = await addDoc(collection(firestore, 'schedules'), scheduleWithDefaults);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating schedule entry:', error);
    return { success: false, error };
  }
};

export const getUserSchedule = async (userId: string) => {
  try {
    const scheduleQuery = query(
      collection(firestore, 'schedules'),
      where('userId', '==', userId),
      orderBy('scheduledFor', 'asc')
    );
    
    const querySnapshot = await getDocs(scheduleQuery);
    const scheduleEntries: Array<ScheduleEntry & { id: string }> = [];
    
    querySnapshot.forEach((doc) => {
      scheduleEntries.push({ id: doc.id, ...doc.data() as ScheduleEntry });
    });
    
    return { success: true, data: scheduleEntries };
  } catch (error) {
    console.error('Error getting user schedule:', error);
    return { success: false, error };
  }
};
