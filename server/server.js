const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helpRoutes = require('./routes/helpRoutes');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes); // <--- Connect the auth routes

app.get('/', (req, res) => {
  res.send('Welcome to HelpHive API!');
});
app.use('/api/help', helpRoutes);
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));
app.use('/api/auth', require('./routes/authRoutes'));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
