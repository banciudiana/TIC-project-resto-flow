require('dotenv').config();
const express = require('express');
const globalAppMiddleware = require('./middleware/globalAppMiddleware');

const app = express();
globalAppMiddleware(app);

//ROUTES
const authRoutes = require('./routes/authRoute');


app.use('/api/auth', authRoutes);
//check logging system for cors, helmet, morgan
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Logging system active' });
});


const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(` Server is running on port ${PORT}`);
  console.log(` Mod: ${process.env.NODE_ENV}`);
});

