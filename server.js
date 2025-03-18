const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/mongodb');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

connectDB();

app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is connected!' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
