// ========================================
// Firebase Configuration & Firestore Service
// ========================================

import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
  getAuth
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Firebase Configuration
// TODO: Replace these with your actual Firebase config from Firebase Console
// Go to: Firebase Console > Project Settings > Your Apps > Web App
const firebaseConfig = {
  apiKey: "AIzaSyAp_Dqcv88FS7t-da_9iFy6x66UKhMzjYA",
  authDomain: "janavi-portfolio.firebaseapp.com",
  projectId: "janavi-portfolio",
  storageBucket: "janavi-portfolio.firebasestorage.app",
  messagingSenderId: "948449119038",
  appId: "1:948449119038:web:ee57bf42eea3fbab04fa6f",
  measurementId: "G-ES1YGB1ZJW"
};

// Check if config is valid
const isConfigValid = firebaseConfig.apiKey && firebaseConfig.apiKey !== '' && !firebaseConfig.apiKey.includes('YOUR_API_KEY');

// Initialize Firebase
let app = null;
let db = null;
let auth = null;
let isFirebaseReady = false;

if (isConfigValid) {
  try {
    app = initializeApp(firebaseConfig);

    db = getFirestore(app);
    auth = getAuth(app);

    isFirebaseReady = true;

    console.log("Firebase initialized successfully");
  } catch (error) {
    console.error("Firebase initialization error:", error);
  }
}
export { FirestoreService, auth };

// ========================================
// FIRESTORE SERVICE
// ========================================
const FirestoreService = {

  isReady() {
    return isFirebaseReady;
  },

  // ========================================
  // PROJECTS CRUD
  // ========================================
  async getProjects() {
    if (!isFirebaseReady) return [];
    try {
      const querySnapshot = await getDocs(collection(db, "projects"));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error getting projects:", error);
      return [];
    }
  },

  async addProject(projectData) {
    if (!isFirebaseReady) throw new Error("Firebase not configured");
    try {
      const docRef = await addDoc(collection(db, "projects"), projectData);
      return { id: docRef.id, ...projectData };
    } catch (error) {
      console.error("Error adding project:", error);
      throw error;
    }
  },

  async updateProject(id, projectData) {
    if (!isFirebaseReady) throw new Error("Firebase not configured");
    try {
      await updateDoc(doc(db, "projects", id), projectData);
      return { id, ...projectData };
    } catch (error) {
      console.error("Error updating project:", error);
      throw error;
    }
  },

  async deleteProject(id) {
    if (!isFirebaseReady) throw new Error("Firebase not configured");
    try {
      await deleteDoc(doc(db, "projects", id));
      return true;
    } catch (error) {
      console.error("Error deleting project:", error);
      throw error;
    }
  },

  subscribeToProjects(callback) {
    if (!isFirebaseReady) {
      callback([]);
      return () => {};
    }
    return onSnapshot(collection(db, "projects"), (snapshot) => {
      const projects = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(projects);
    });
  },

  // ========================================
  // EXPERIENCE CRUD
  // ========================================
  async getExperiences() {
    if (!isFirebaseReady) return [];
    try {
      const querySnapshot = await getDocs(collection(db, "experience"));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error getting experiences:", error);
      return [];
    }
  },

  async addExperience(experienceData) {
    if (!isFirebaseReady) throw new Error("Firebase not configured");
    try {
      const docRef = await addDoc(collection(db, "experience"), experienceData);
      return { id: docRef.id, ...experienceData };
    } catch (error) {
      console.error("Error adding experience:", error);
      throw error;
    }
  },

  async updateExperience(id, experienceData) {
    if (!isFirebaseReady) throw new Error("Firebase not configured");
    try {
      await updateDoc(doc(db, "experience", id), experienceData);
      return { id, ...experienceData };
    } catch (error) {
      console.error("Error updating experience:", error);
      throw error;
    }
  },

  async deleteExperience(id) {
    if (!isFirebaseReady) throw new Error("Firebase not configured");
    try {
      await deleteDoc(doc(db, "experience", id));
      return true;
    } catch (error) {
      console.error("Error deleting experience:", error);
      throw error;
    }
  },

  subscribeToExperiences(callback) {
    if (!isFirebaseReady) {
      callback([]);
      return () => {};
    }
    return onSnapshot(collection(db, "experience"), (snapshot) => {
      const experiences = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(experiences);
    });
  },

  

  
  // ========================================
  // CERTIFICATIONS CRUD
  // ========================================
  async getCertifications() {
    if (!isFirebaseReady) return [];
    try {
      const querySnapshot = await getDocs(collection(db, "certifications"));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error getting certifications:", error);
      return [];
    }
  },

  async addCertification(certificationData) {
    if (!isFirebaseReady) throw new Error("Firebase not configured");
    try {
      const docRef = await addDoc(collection(db, "certifications"), certificationData);
      return { id: docRef.id, ...certificationData };
    } catch (error) {
      console.error("Error adding certification:", error);
      throw error;
    }
  },

  async updateCertification(id, certificationData) {
    if (!isFirebaseReady) throw new Error("Firebase not configured");
    try {
      await updateDoc(doc(db, "certifications", id), certificationData);
      return { id, ...certificationData };
    } catch (error) {
      console.error("Error updating certification:", error);
      throw error;
    }
  },

  async deleteCertification(id) {
    if (!isFirebaseReady) throw new Error("Firebase not configured");
    try {
      await deleteDoc(doc(db, "certifications", id));
      return true;
    } catch (error) {
      console.error("Error deleting certification:", error);
      throw error;
    }
  },

  subscribeToCertifications(callback) {
    if (!isFirebaseReady) {
      callback([]);
      return () => {};
    }
    return onSnapshot(collection(db, "certifications"), (snapshot) => {
      const certifications = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(certifications);
    });
  },

  // ========================================
  // SKILLS
  // ========================================
  async getSkills() {
    if (!isFirebaseReady) return { design: [], tools: [], development: [] };
    try {
      const designDoc = await getDoc(doc(db, "skills", "design"));
      const toolsDoc = await getDoc(doc(db, "skills", "tools"));
      const developmentDoc = await getDoc(doc(db, "skills", "development"));

      return {
        design: designDoc.exists() ? designDoc.data().skills || [] : [],
        tools: toolsDoc.exists() ? toolsDoc.data().skills || [] : [],
        development: developmentDoc.exists() ? developmentDoc.data().skills || [] : []
      };
    } catch (error) {
      console.error("Error getting skills:", error);
      return { design: [], tools: [], development: [] };
    }
  },

  async saveSkills(skillsData) {
    if (!isFirebaseReady) throw new Error("Firebase not configured");
    try {
      await setDoc(doc(db, "skills", "design"), { skills: skillsData.design || [] });
      await setDoc(doc(db, "skills", "tools"), { skills: skillsData.tools || [] });
      await setDoc(doc(db, "skills", "development"), { skills: skillsData.development || [] });
      return true;
    } catch (error) {
      console.error("Error saving skills:", error);
      throw error;
    }
  },

  subscribeToSkills(callback) {
    if (!isFirebaseReady) {
      callback({ design: [], tools: [], development: [] });
      return () => {};
    }
    const unsubscribers = [];

    const checkAll = async () => {
      const skills = await this.getSkills();
      callback(skills);
    };

    unsubscribers.push(
      onSnapshot(doc(db, "skills", "design"), checkAll),
      onSnapshot(doc(db, "skills", "tools"), checkAll),
      onSnapshot(doc(db, "skills", "development"), checkAll)
    );

    return () => unsubscribers.forEach(unsub => unsub());
  },

  // ========================================
  // ABOUT CONTENT
  // ========================================
  async getAboutContent() {
    if (!isFirebaseReady) return { journey: "", goals: "", philosophy: "" };
    try {
      const docSnap = await getDoc(doc(db, "about", "content"));
      if (docSnap.exists()) {
        return docSnap.data();
      }
      return { journey: "", goals: "", philosophy: "" };
    } catch (error) {
      console.error("Error getting about content:", error);
      return { journey: "", goals: "", philosophy: "" };
    }
  },

  async saveAboutContent(aboutData) {
    if (!isFirebaseReady) throw new Error("Firebase not configured");
    try {
      await setDoc(doc(db, "about", "content"), aboutData);
      return true;
    } catch (error) {
      console.error("Error saving about content:", error);
      throw error;
    }
  },

  // ========================================
  // CONTACT INFO
  // ========================================
  async getContactInfo() {
    if (!isFirebaseReady) return { email: "", phone: "", location: "", availability: "" };
    try {
      const docSnap = await getDoc(doc(db, "about", "contact"));
      if (docSnap.exists()) {
        return docSnap.data();
      }
      return { email: "", phone: "", location: "", availability: "" };
    } catch (error) {
      console.error("Error getting contact info:", error);
      return { email: "", phone: "", location: "", availability: "" };
    }
  },

  async saveContactInfo(contactData) {
    if (!isFirebaseReady) throw new Error("Firebase not configured");
    try {
      await setDoc(doc(db, "about", "contact"), contactData);
      return true;
    } catch (error) {
      console.error("Error saving contact info:", error);
      throw error;
    }
  },

  // ========================================
// CONTACT MESSAGES
// ========================================

async saveContactMessage(messageData) {
  if (!isFirebaseReady) throw new Error("Firebase not configured");

  const docRef = await addDoc(
    collection(db, "contactMessages"),
    {
      ...messageData,
      createdAt: new Date().toLocaleString()
    }
  );

  return docRef.id;
},

async getContactMessages() {

  if (!isFirebaseReady) return [];

  const snapshot =
    await getDocs(collection(db, "contactMessages"));

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
},
 

  // ========================================
  // PERSONAL INFO
  // ========================================
  async getPersonalInfo() {
    if (!isFirebaseReady) return { name: "Janavi Parmar", role: "UI/UX Designer", resumeLink: "" };
    try {
      const docSnap = await getDoc(doc(db, "about", "personal"));
      if (docSnap.exists()) {
        return docSnap.data();
      }
      return { name: "Janavi Parmar", role: "UI/UX Designer", resumeLink: "" };
    } catch (error) {
      console.error("Error getting personal info:", error);
      return { name: "Janavi Parmar", role: "UI/UX Designer", resumeLink: "" };
    }
  },

  async savePersonalInfo(personalData) {
    if (!isFirebaseReady) throw new Error("Firebase not configured");
    try {
      await setDoc(doc(db, "about", "personal"), personalData);
      return true;
    } catch (error) {
      console.error("Error saving personal info:", error);
      throw error;
    }
  }
};

export { FirestoreService };

