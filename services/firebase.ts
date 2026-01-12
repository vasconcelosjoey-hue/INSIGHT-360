import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { UserInfo, ProcessedResult } from '../types';

// --- CONFIGURAÇÃO DO FIREBASE ---
const firebaseConfig = {
  apiKey: "AIzaSyCkpwisB2z2W5iCY9VYU_BE4cGZ0buv4cc",
  authDomain: "insight360-ae5c7.firebaseapp.com",
  projectId: "insight360-ae5c7",
  storageBucket: "insight360-ae5c7.firebasestorage.app",
  messagingSenderId: "705424550512",
  appId: "1:705424550512:web:24f23eab01d722b579a2b5"
};

// Inicialização segura
let db: any = null;

try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log("Firebase conectado com sucesso!");
} catch (error) {
    console.error("Erro ao inicializar Firebase:", error);
}

export const saveTestResult = async (userInfo: UserInfo, results: ProcessedResult[]) => {
  if (!db) {
    console.warn("Banco de dados não inicializado corretamente.");
    return false;
  }

  try {
    // Prepara o objeto para salvar
    // Filtra apenas os dados essenciais dos resultados para economizar espaço
    const simpleResults = results.map(r => ({
        id: r.dimensionId,
        name: r.dimensionName,
        score: Math.round(r.score)
    }));

    await addDoc(collection(db, "leads"), {
      ...userInfo,
      results: simpleResults,
      createdAt: serverTimestamp(),
      platform: navigator.userAgent, // Útil para saber se foi mobile/desktop
      completedAt: new Date().toISOString()
    });

    console.log("Lead salvo com sucesso!");
    return true;

  } catch (e) {
    console.error("Erro ao salvar lead no Firestore: ", e);
    return false;
  }
};