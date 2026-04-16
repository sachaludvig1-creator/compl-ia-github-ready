'use strict';

/* ===================================================
   firebase-service.js — Module d'accès aux données
   Connexion asynchrone à Firebase Firestore.
   Gère un fallback vers window.AppState local.
   =================================================== */

window.FirebaseService = {
  db: null,
  auth: null,
  isInitialized: false,
  _ops: {},
  _authOps: {},

  async init() {
    console.log('[Firebase] Initialisation...');
    try {
      const { initializeApp } = await import("https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js");
      const { 
        getFirestore, collection, addDoc, getDocs, getDoc, updateDoc, doc, query, where, orderBy, setDoc 
      } = await import("https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js");
      const { 
        getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut
      } = await import("https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js");
      
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
      this.auth = getAuth(app);
      this._ops = { collection, addDoc, getDocs, getDoc, updateDoc, doc, query, where, orderBy, setDoc };
      this._authOps = { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut };
      
      this.isInitialized = true;
      console.log('[Firebase] Connecté à Firestore avec succès !');
      return true;
    } catch (e) {
      console.warn('[Firebase] Impossible de contacter Firebase, mode fallback activé.', e);
      this.isInitialized = false;
      return false;
    }
  },

  /* --- AUTHENTIFICATION --- */

  onAuthStateChanged(callback) {
    if (!this.isInitialized) return callback(null);
    return this._authOps.onAuthStateChanged(this.auth, callback);
  },

  async registerWithEmail(email, password) {
    if (!this.isInitialized) throw new Error("Firebase non initialisé");
    const { createUserWithEmailAndPassword } = this._authOps;
    const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
    return userCredential.user;
  },

  async loginWithEmail(email, password) {
    if (!this.isInitialized) throw new Error("Firebase non initialisé");
    const { signInWithEmailAndPassword } = this._authOps;
    const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
    return userCredential.user;
  },

  async loginWithGoogle() {
    if (!this.isInitialized) throw new Error("Firebase non initialisé");
    const { GoogleAuthProvider, signInWithPopup } = this._authOps;
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(this.auth, provider);
    return userCredential.user;
  },

  async logout() {
    if (!this.isInitialized) return;
    window.AppState.currentUser = null;
    await this._authOps.signOut(this.auth);
  },

  /* --- MÉTADONNÉES UTILISATEUR (Firestore) --- */

  async fetchUserDoc(uid) {
    if (!this.isInitialized) return null;
    const { doc, getDoc, setDoc } = this._ops;
    const docRef = doc(this.db, "users", uid);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      // Mettre à jour l'heure de dernier login
      await setDoc(docRef, { lastLoginAt: Date.now() }, { merge: true });
      return data;
    }
    return null;
  },

  async createUserDoc(uid, data) {
    if (!this.isInitialized) return;
    const { doc, setDoc } = this._ops;
    const docRef = doc(this.db, "users", uid);
    data.created_at = Date.now();
    data.lastLoginAt = Date.now();
    data.uid = uid;
    await setDoc(docRef, data, { merge: true });
  },

  async updateUserDoc(uid, data) {
    if (!this.isInitialized) return;
    const { doc, setDoc } = this._ops;
    const docRef = doc(this.db, "users", uid);
    await setDoc(docRef, data, { merge: true });
  },

  async fetchSubmissions(user) {
    if (!this.isInitialized) {
      const localMap = window.AppState.submissions;
      if (user.role_type === 'juridique') return localMap.filter(s => s.statut === 'en_cours');
      return localMap; // SMM voit tout dans le fallback (et les siens potentiellement)
    }

    const { collection, query, where, getDocs } = this._ops;
    try {
      const subsRef = collection(this.db, "submissions");
      let q;
      
      if (user.role_type === 'juridique') {
        q = query(subsRef, where("statut", "==", "en_cours"));
      } else {
        q = query(subsRef, where("submitted_by", "==", user.uid || user.id));
      }

      const querySnapshot = await getDocs(q);
      const remoteSubs = [];
      querySnapshot.forEach((doc) => {
        remoteSubs.push({ id: doc.id, ...doc.data() });
      });

      if (remoteSubs.length === 0) {
        console.log('[Firebase] Collection vide (ou 0 résultat), inclusion du fallback fictif.');
        const fakeData = [...window.AppState.submissions];
        return (user.role_type === 'juridique') 
               ? fakeData.filter(s => s.statut === 'en_cours')
               : fakeData;
      }

      /* Tri descendant local pour éviter Firebase error de Missing Index */
      remoteSubs.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

      return (user.role_type === 'juridique') 
             ? remoteSubs.filter(s => s.statut === 'en_cours')
             : remoteSubs;

    } catch (e) {
      console.error("[Firebase] Error fetching submissions", e);
      const fakeData = [...window.AppState.submissions];
      return (user.role_type === 'juridique') 
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
