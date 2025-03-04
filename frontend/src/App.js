import React, { useState, useEffect } from 'react';
import ImageComponent from './components/image_selector';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
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
