import React, { useState, useEffect } from 'react';
import ImageComponent from './components/image_selector';
import fbConfig from './configuration/firebase';
import { getDatabase, ref, onValue, set } from "firebase/database";

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const db = getDatabase(fbConfig);
    console.log(db);
    set(ref(db, 'users/' + "test"), {
      username: "test",
      email: "test",
      profile_picture : "test"
    });

    fetch('/api/test')
      .then(response => response.json())
      .then(data => setMessage(data.message));
  }, []);

  return (
    <div>
      <ImageComponent />
    </div>
  );
}

export default App;
