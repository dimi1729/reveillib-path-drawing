 import { initializeApp } from "firebase/app";
 import {
   getAuth,
   createUserWithEmailAndPassword,
   signInWithEmailAndPassword,
   signInWithPopup,
   GoogleAuthProvider,
   signOut,
   onAuthStateChanged,
 } from "firebase/auth";
 
 // Your Firebase configuration
 const firebaseConfig = {
  apiKey: "AIzaSyCc6HArXFQ77O2_y1JmLQ_PYUpKE8PR1Xk",
  authDomain: "whoop-web.firebaseapp.com",
  databaseURL: "https://whoop-web-default-rtdb.firebaseio.com",
  projectId: "whoop-web",
  storageBucket: "whoop-web.firebasestorage.app",
  messagingSenderId: "344928440756",
  appId: "1:344928440756:web:088b40a656144517ba62e1",
  measurementId: "G-M165970TY1"
};

 
 // Initialize Firebase
 const app = initializeApp(firebaseConfig);
 const auth = getAuth(app); // Initialize auth
 
 // FirebaseManager Class
 class FirebaseManager {
   constructor() {
     this.auth = auth; // Expose auth as a property
   }
 
   /**
    * Automatically detect if the user should sign in or sign up
    * @param {string} email - The user's email
    * @param {string} password - The user's password
    */
   async signInOrSignUp(email, password) {
     try {
       await signInWithEmailAndPassword(this.auth, email, password);
       console.log("User signed in successfully!");
     } catch (signInError) {
       try {
         const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
         const user = userCredential.user;
         console.log("User created successfully:", user.uid);
       } catch (signUpError) {
         console.error("Error during sign-up:", signUpError.message);
         throw signUpError;
       }
     }
   }
 
   /**
    * Sign in with Google
    */
   async signInWithGoogle() {
     const googleProvider = new GoogleAuthProvider();
     try {
       const result = await signInWithPopup(this.auth, googleProvider);
       const user = result.user;
       console.log("User signed in with Google:", user.displayName);
     } catch (error) {
       console.error("Error signing in with Google:", error.message);
       throw error;
     }
   }
 
   /**
    * Sign out the current user
    */
   async logOut() {
     try {
       await signOut(this.auth);
       console.log("User signed out successfully!");
     } catch (error) {
       console.error("Error signing out:", error.message);
       throw error;
     }
   }
 
   /**
    * Listen for authentication state changes
    * @param {Function} callback - The callback function to execute when the auth state changes
    */
   onAuthStateChange(callback) {
     return onAuthStateChanged(this.auth, (user) => {
       if (user) {
         callback(user);
       } else {
         callback(null);
       }
     });
   }
 }
 
 // Export an instance of FirebaseManager
 export const firebaseManager = new FirebaseManager();
 
 // Export auth directly for convenience
 export { auth };