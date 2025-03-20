// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

class firebase_wrapper {
    #app = null;


    constructor(){
        const firebaseConfig = {
        apiKey: "AIzaSyCc6HArXFQ77O2_y1JmLQ_PYUpKE8PR1Xk",
        authDomain: "whoop-web.firebaseapp.com",
        projectId: "whoop-web",
        storageBucket: "whoop-web.firebasestorage.app",
        messagingSenderId: "344928440756",
        appId: "1:344928440756:web:088b40a656144517ba62e1",
        measurementId: "G-M165970TY1"
        };

        this.app = initializeApp(firebaseConfig);
    }
};

export default firebase_wrapper;