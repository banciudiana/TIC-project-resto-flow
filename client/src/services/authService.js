import { auth } from '../config/firebaseClient';
import { signInWithEmailAndPassword, 
    signOut, onAuthStateChanged } from "firebase/auth";

export const authService = {
  
  async login(email, password) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  },

  async logout() {
    await signOut(auth);
  },


  getCurrentUser(callback) {
    return onAuthStateChanged(auth, callback);
  }
};