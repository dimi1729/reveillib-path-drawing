const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Connect to Firebase
// const firebase = require('./config/firebase');

const { default: firebase_wrapper } = require('./config/firebase');

// Example usage of firebase
const fb = new firebase_wrapper();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);



app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is connected!' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
