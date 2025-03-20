// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

class firebase {
    #app = null;


    constructor(){
        const firebaseConfig = {
        authDomain: "whoop-web.firebaseapp.com",
        projectId: "whoop-web",
        storageBucket: "whoop-web.firebasestorage.app",
        messagingSenderId: "344928440756",
        appId: "1:344928440756:web:088b40a656144517ba62e1",
        measurementId: "G-M165970TY1"
        };

        this.app = initializeApp(firebaseConfig);
        console.log(this.app);
    }
};

export default firebase;