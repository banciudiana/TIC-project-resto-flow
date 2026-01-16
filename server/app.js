require('dotenv').config();
const express = require('express');
const globalAppMiddleware = require('./middleware/globalAppMiddleware');


const app = express();
app.use(express.json());
globalAppMiddleware(app);


// ROUTES
const authRoutes = require('./routes/authRoute');
const productRoutes = require('./routes/productRoute');
const orderRoutes = require('./routes/orderRoute');
const categoryRoutes = require('./routes/categoryRoute');


app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);

// check logging system for cors, helmet, morgan
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Logging system active' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(` Server is running on port ${PORT}`);
  console.log(` Mod: ${process.env.NODE_ENV}`);
});