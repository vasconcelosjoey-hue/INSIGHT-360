
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
  console.log("🚀 Firebase: Conexão estabelecida.");
} catch (error) {
  console.error("❌ Firebase: Erro de conexão:", error);
}

export const saveTestResult = async (userInfo: UserInfo, results: ProcessedResult[], testId: string) => {
  if (!db) return false;

  try {
    const docRef = await addDoc(collection(db, "leads"), {
      testId,
      name: userInfo.name,
      email: userInfo.email || "não informado",
      whatsapp: userInfo.whatsapp,
      results: results.map(r => ({
        id: r.dimensionId,
        name: r.dimensionName,
        score: Math.round(r.score)
      })),
      createdAt: serverTimestamp(),
      completedAt: new Date().toISOString()
    });
    console.log("✅ Dados sincronizados. ID:", docRef.id);
    return true;
  } catch (e) {
    console.error("❌ Erro ao sincronizar:", e);
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
    console.error("❌ Erro ao buscar dados:", e);
    return [];
  }
};
