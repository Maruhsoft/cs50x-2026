require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Simple health route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Basic MongoDB connection
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/final_project_db';
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.warn('MongoDB connection error:', err));

// Example user model and routes
const User = require('./models/User');

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = new User({ name, email, password });
    await user.save();
    res.status(201).json({ id: user._id, name: user.name, email: user.email });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/users', async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
