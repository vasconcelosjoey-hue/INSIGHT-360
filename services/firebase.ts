
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp, getDocs, query, orderBy, where } from 'firebase/firestore';
import { UserInfo, ProcessedResult, Company } from '../types';

const firebaseConfig = {
  apiKey: "AIzaSyCkpwisB2z2W5iCY9VYU_BE4cGZ0buv4cc",
  authDomain: "insight360-ae5c7.firebaseapp.com",
  projectId: "insight360-ae5c7",
  storageBucket: "insight360-ae5c7.firebasestorage.app",
  messagingSenderId: "705424550512",
  appId: "1:705424550512:web:24f23eab01d722b579a2b5"
};

// Singleton pattern para inicialização do Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { db };

export const saveCompany = async (company: Omit<Company, 'id' | 'createdAt'>) => {
  try {
    const docRef = await addDoc(collection(db, "companies"), {
      ...company,
      name: company.name.toUpperCase(),
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error("Erro detalhado ao salvar empresa:", error);
    throw error;
  }
};

export const getActiveCompanies = async () => {
  try {
    const now = new Date().toISOString().split('T')[0];
    const q = query(collection(db, "companies"), orderBy("name", "asc"));
    const snapshot = await getDocs(q);
    return snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() } as Company))
      .filter(c => now >= c.startDate && now <= c.endDate);
  } catch (error) {
    console.error("Erro ao buscar empresas ativas:", error);
    return [];
  }
};

export const getAllCompanies = async () => {
  try {
    const q = query(collection(db, "companies"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Company));
  } catch (error) {
    console.error("Erro ao carregar todas as empresas:", error);
    return [];
  }
};

export const saveTestResult = async (userInfo: UserInfo, results: ProcessedResult[], testId: string) => {
  try {
    await addDoc(collection(db, "leads"), {
      testId,
      ...userInfo,
      results: results.map(r => ({ id: r.dimensionId, name: r.dimensionName, score: r.score })),
      createdAt: serverTimestamp(),
      completedAt: new Date().toISOString()
    });
    return true;
  } catch (e) {
    console.error("Save Test Result Error:", e);
    return false;
  }
};

export const getAllLeads = async () => {
  try {
    const q = query(collection(db, "leads"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Erro ao buscar leads:", error);
    return [];
  }
};

export const getCompanyAggregate = async (companyId: string) => {
  try {
    const q = query(collection(db, "leads"), where("companyId", "==", companyId));
    const snapshot = await getDocs(q);
    const leads = snapshot.docs.map(d => d.data());
    if (leads.length === 0) return null;

    const dimensionTotals: Record<string, { sum: number, count: number, name: string }> = {};
    leads.forEach((lead: any) => {
      lead.results.forEach((r: any) => {
        if (!dimensionTotals[r.id]) dimensionTotals[r.id] = { sum: 0, count: 0, name: r.name };
        dimensionTotals[r.id].sum += r.score;
        dimensionTotals[r.id].count += 1;
      });
    });

    return Object.keys(dimensionTotals).map(id => ({
      dimensionId: id,
      dimensionName: dimensionTotals[id].name,
      score: Math.round(dimensionTotals[id].sum / dimensionTotals[id].count),
      description: ''
    }));
  } catch (error) {
    console.error("Erro ao agregar dados da empresa:", error);
    return null;
  }
};
