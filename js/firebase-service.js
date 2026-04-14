'use strict';

/* ===================================================
   firebase-service.js — Module d'accès aux données
   Connexion asynchrone à Firebase Firestore.
   Gère un fallback vers window.AppState local.
   =================================================== */

window.FirebaseService = {
  db: null,
  isInitialized: false,
  _ops: {},

  async init() {
    console.log('[Firebase] Initialisation...');
    try {
      const { initializeApp } = await import("https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js");
      const { 
        getFirestore, collection, addDoc, getDocs, getDoc, updateDoc, doc, query, where, orderBy, setDoc 
      } = await import("https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js");
      
      const firebaseConfig = {
        apiKey: "AIzaSyB8J9h9_kUsB0UCf7oag8iFt9hRIC0Cx30",
        authDomain: "grp10-edb5d.firebaseapp.com",
        projectId: "grp10-edb5d",
        storageBucket: "grp10-edb5d.firebasestorage.app",
        messagingSenderId: "295734027401",
        appId: "1:295734027401:web:ecb3ddcefcfa2644fd9258",
        measurementId: "G-WEB0FBVN3D"
      };

      const app = initializeApp(firebaseConfig);
      this.db = getFirestore(app);
      this._ops = { collection, addDoc, getDocs, getDoc, updateDoc, doc, query, where, orderBy, setDoc };
      
      this.isInitialized = true;
      console.log('[Firebase] Connecté à Firestore avec succès !');
      return true;
    } catch (e) {
      console.warn('[Firebase] Impossible de contacter Firebase, mode fallback activé.', e);
      this.isInitialized = false;
      return false;
    }
  },

  async loginUser(role) {
    if (!this.isInitialized) return PROFILS[role];

    const { doc, setDoc, getDoc } = this._ops;
    try {
      const docRef = doc(this.db, "users", "XpRyne6Zy4NvsTZeDvsw");
      const localRoleData = PROFILS[role];
      
      const roleToSave = role === 'juridique' ? 'legal' : role;
      
      await setDoc(docRef, { lastLoginAt: Date.now(), roleActif: roleToSave }, { merge: true });
      return localRoleData;
    } catch (e) {
      console.error("[Firebase] Exception login", e);
      return PROFILS[role];
    }
  },

  async fetchSubmissions(user) {
    if (!this.isInitialized) {
      const localMap = window.AppState.submissions;
      if (user.role === 'juridique') return localMap.filter(s => s.statut === 'en_cours');
      return localMap; // SMM voit tout dans le fallback (et les siens potentiellement)
    }

    const { collection, query, where, getDocs } = this._ops;
    try {
      const subsRef = collection(this.db, "submissions");
      let q;
      
      if (user.role === 'juridique') {
        q = query(subsRef, where("statut", "==", "en_cours"));
      } else {
        q = query(subsRef, where("submitted_by", "==", user.id));
      }

      const querySnapshot = await getDocs(q);
      const remoteSubs = [];
      querySnapshot.forEach((doc) => {
        remoteSubs.push({ id: doc.id, ...doc.data() });
      });

      if (remoteSubs.length === 0) {
        console.log('[Firebase] Collection vide (ou 0 résultat), inclusion du fallback fictif.');
        const fakeData = [...window.AppState.submissions];
        return (user.role === 'juridique' || user.role === 'legal') 
               ? fakeData.filter(s => s.statut === 'en_cours')
               : fakeData;
      }

      /* Tri descendant local pour éviter Firebase error de Missing Index */
      remoteSubs.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

      return (user.role === 'juridique' || user.role === 'legal') 
             ? remoteSubs.filter(s => s.statut === 'en_cours')
             : remoteSubs;

    } catch (e) {
      console.error("[Firebase] Error fetching submissions", e);
      const fakeData = [...window.AppState.submissions];
      return (user.role === 'juridique' || user.role === 'legal') 
             ? fakeData.filter(s => s.statut === 'en_cours')
             : fakeData;
    }
  },

  async createSubmission(data) {
    if (!this.isInitialized) {
      const simulatedObj = { ...data, id: 'sub-new-' + Date.now(), timestamp: Date.now() };
      window.AppState.submissions.unshift(simulatedObj);
      return simulatedObj;
    }

    const { collection, addDoc, doc, setDoc } = this._ops;
    try {
      /* Le document placeholder donné est BMsD3l2aWPAvx99rNwBE, supprimons ce cas car on veut un auto-id */
      data.timestamp = Date.now();
      const docRef = await addDoc(collection(this.db, "submissions"), data);
      return { ...data, id: docRef.id };
    } catch (e) {
      console.error("[Firebase] Add submission failed", e);
      return null;
    }
  },

  async updateSubmissionStatus(subId, data) {
    if (!this.isInitialized || subId.startsWith('sub-')) {
       // Les soumissions locales fictives sont modifiées dans window.AppState
       const sub = window.AppState.submissions.find(s => s.id === subId);
       if (sub) Object.assign(sub, data);
       return true;
    }

    const { doc, updateDoc } = this._ops;
    try {
      const docRef = doc(this.db, "submissions", subId);
      await updateDoc(docRef, data);
      return true;
    } catch (e) {
      console.error("[Firebase] Edit submission failed", e);
      return false;
    }
  },

  async fetchComments(subId) {
    if (!this.isInitialized || subId.startsWith('sub-')) return [];

    const { collection, query, where, getDocs } = this._ops;
    try {
      const q = query(collection(this.db, "comments"), where("submission_id", "==", subId));
      const qs = await getDocs(q);
      const arr = [];
      qs.forEach(d => arr.push(d.data()));
      
      arr.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
      return arr;
    } catch (e) {
      return [];
    }
  },

  async createComment(data) {
    if (!this.isInitialized || data.submission_id.startsWith('sub-')) return true;

    const { collection, addDoc } = this._ops;
    try {
      data.timestamp = Date.now();
      await addDoc(collection(this.db, "comments"), data);
      return true;
    } catch (e) {
      console.error("[Firebase] Failed to add comment", e);
      return false;
    }
  }
};
