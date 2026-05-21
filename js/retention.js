'use strict';

window.RetentionService = {
  INACTIVITY_DAYS: 7,
  COOLDOWN_DAYS: 7,

  /* Vérifie l'inactivité au login */
  async checkInactivity(user) {
    if (!window.FirebaseService) return;
    
    try {
      const userData = await window.FirebaseService.getUserData(user.uid);
      if (!userData) return;

      if (userData.email_opt_out) {
        console.log('[Retention] Utilisateur opt-out, pas de réactivation.');
        return;
      }
      
      const lastActive = userData.last_active_at?.toDate
        ? userData.last_active_at.toDate()
        : new Date(userData.last_active_at || 0);
      
      const lastReactivation = userData.last_reactivation_sent?.toDate
        ? userData.last_reactivation_sent.toDate()
        : (userData.last_reactivation_sent ? new Date(userData.last_reactivation_sent) : null);

      const daysSinceActive = Math.floor(
        (Date.now() - lastActive.getTime()) / (1000 * 60 * 60 * 24)
      );

      const daysSinceReactivation = lastReactivation
        ? Math.floor(
            (Date.now() - lastReactivation.getTime()) 
            / (1000 * 60 * 60 * 24)
          )
        : 999;

      /* Déclencher si inactif 7j+ et cooldown respecté */
      if (
        daysSinceActive >= this.INACTIVITY_DAYS &&
        daysSinceReactivation >= this.COOLDOWN_DAYS
      ) {
        await this.triggerReactivation(user, userData, daysSinceActive);
      }
    } catch (e) {
      console.warn('[Retention] Erreur checkInactivity:', e);
    }
  },

  /* Déclenche email + notification in-app */
  async triggerReactivation(user, userData, daysSinceActive) {
    /* 1. Notification in-app */
    window.AppState.showWelcomeBack = true;
    window.AppState.welcomeBackDays = daysSinceActive;

    /* 2. Email via /api/reactivation */
    try {
      await fetch('/api/reactivation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          prenom: userData.prenom || 'Utilisateur',
          entreprise: userData.entreprise || 'Votre entreprise',
          daysSinceActive: daysSinceActive
        })
      });

      // Tracker l'événement "reactivation_sent"
      await this.trackEvent('reactivation_sent', user.uid, daysSinceActive);

    } catch (e) {
      console.warn('[Compl-IA] Email réactivation échoué :', e);
    }

    /* 3. Mettre à jour last_reactivation_sent dans Firestore */
    await window.FirebaseService.updateUserData(user.uid, {
      last_reactivation_sent: new Date()
    });
  },

  /* Mettre à jour last_active_at à chaque action */
  async trackActivity(uid) {
    if (!uid || !window.FirebaseService) return;
    try {
      await window.FirebaseService.updateUserData(uid, {
        last_active_at: new Date()
      });
    } catch (e) {
      console.warn('[Retention] Erreur trackActivity:', e);
    }
  },

  /* Tracker un événement d'analytics */
  async trackEvent(type, uid, daysSinceActive = 0) {
    if (!window.FirebaseService || !window.FirebaseService._ops) return;
    try {
      const { collection, addDoc } = window.FirebaseService._ops;
      await addDoc(collection(window.FirebaseService.db, 'retention_events'), {
        type,
        uid,
        timestamp: new Date(),
        daysSinceActive
      });
    } catch (e) {
      console.warn('[Retention] Erreur trackEvent:', e);
    }
  }
};
