
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp, getDocs, query, orderBy } from 'firebase/firestore';
import { UserInfo, ProcessedResult } from '../types';

const firebaseConfig = {
  apiKey: "AIzaSyCkpwisB2z2W5iCY9VYU_BE4cGZ0buv4cc",
  authDomain: "insight360-ae5c7.firebaseapp.com",
  projectId: "insight360-ae5c7",
  storageBucket: "insight360-ae5c7.firebasestorage.app",
  messagingSenderId: "705424550512",
  appId: "1:705424550512:web:24f23eab01d722b579a2b5"
};

let db: any = null;

try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
} catch (error) {
    console.error("Erro ao inicializar Firebase:", error);
}

export const saveTestResult = async (userInfo: UserInfo, results: ProcessedResult[], testId: string) => {
  if (!db) return false;

  try {
    const simpleResults = results.map(r => ({
        id: r.dimensionId,
        name: r.dimensionName,
        score: Math.round(r.score)
    }));

    await addDoc(collection(db, "leads"), {
      testId: testId,
      ...userInfo,
      results: simpleResults,
      createdAt: serverTimestamp(),
      platform: navigator.userAgent,
      completedAt: new Date().toISOString()
    });

    return true;
  } catch (e) {
    console.error("Erro ao salvar lead: ", e);
    return false;
  }
};

export const getAllLeads = async () => {
  if (!db) return [];
  try {
    const q = query(collection(db, "leads"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (e) {
    console.error("Erro ao buscar leads: ", e);
    return [];
  }
};
