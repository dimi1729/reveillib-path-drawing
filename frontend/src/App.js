import React, { useState, useEffect } from 'react';
import ImageComponent from './components/image_selector';

// Firebase Seperate File Test ==> NOT WORKING
// going to try making a context container for firebase and any other global state
// import FirestoreSeperateFileTest from './components/rtfb_test';

// Firebase imports
import fbConfig from './configuration/firebase';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";
import { getFirestore, collection, query, onSnapshot } from "firebase/firestore";

// Create Firebase context
const FirebaseContext = React.createContext(fbConfig);

function App() {
  const [message, setMessage] = useState('');


  // Firebase Tests

  // get the firebase context
  const firebase = React.useContext(FirebaseContext);

  // firestore database listener test
  React.useEffect(() => {
    const db = getFirestore(firebase);
    const q = query(collection(db, "test"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      document.querySelector('#testingFirestore').innerHTML = '';
      querySnapshot.forEach((doc) => {
        document.querySelector('#testingFirestore').innerHTML += `<p>${doc.data().name}</p>`;
        console.log(doc.data());
      });
    });

  }, []);
  // Test works with changing the database, unsure what it will do with pushing data from the app (check for potential looping)

  // realtime database test
  useEffect(() => {
    const db = getDatabase(fbConfig);
    console.log(db);
    set(ref(db, 'users/' + "test"), {
      username: "test",
      email: "test",
      profile_picture: "test"
    });
  // Setting data works, but switched to firestore for real time collaboration features
  // Might use for an admin console or something similar

  fetch('/api/test')
    .then(response => response.json())
    .then(data => setMessage(data.message));
}, []);

return (
  <div>
    <ImageComponent />

    {/* Need to include this in order to use the firebase listeners above, will have to look at how best to add firebase to other files  */}
    <FirebaseContext.Provider value={fbConfig}>
      <h1> Spacing </h1>
      <h1> Spacing </h1>
      <h1> Spacing </h1>
      <h1> Spacing </h1>
      <h1> Spacing </h1>
      <h1> Spacing </h1>
      <h1> Spacing </h1>
      <h1> Spacing </h1>
      <div id="testingFirestore"></div>
      {/* Firebase Test ==> NOT WORKING*/}
      {/* <FirestoreSeperateFileTest /> */}
    </FirebaseContext.Provider>



  </div>
);
}

export default App;
