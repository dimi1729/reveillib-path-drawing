// NOT WORKING

import React, { useState, useRef } from 'react';
import CodeBlocks from './code_blocks'

// Firebase imports
import fbConfig from '../configuration/firebase';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";
import { getFirestore, collection, query, onSnapshot } from "firebase/firestore";

const FirebaseContext = React.createContext(fbConfig);

function FirestoreSeperateFileTest() {
    
React.useEffect(() => {
    // get the firebase context
    const firebase = React.useContext(FirebaseContext);
    const db = getFirestore(firebase);
    const q = query(collection(db, "test"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        document.querySelector('.fbwrapper').innerHTML += `<p>${doc.data().name}</p>`;
        console.log(doc.data());
      });
    });

  }, []);

return (
    <div className="fbwrapper">
    </div>
);
}

export default FirestoreSeperateFileTest;
