require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');

const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const aiRoutes = require('./routes/aiRoutes');

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));
app.use(cors());

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai_ecommerce';

connectDB(MONGODB_URI);

// serve uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// api routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/ai', aiRoutes);

app.get('/', (req, res) => res.send('AI E-Commerce Backend running'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
