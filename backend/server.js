

require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');

const app = express();


app.use(cors({
  origin: 'http://localhost:3000',
}));

//  JSON parser BEFORE routes
app.use(express.json());

// routes
app.use('/auth', authRoutes);



// test route
app.get('/', (req, res) => {
  res.send('Backend running');
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.listen(process.env.PORT || 8080, () => {
  console.log(`Server started`);
});
