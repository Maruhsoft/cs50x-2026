import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
dotenv.config();
connectDB();
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/products', productRoutes);
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'healthy', message: 'Abuja Markets Server is active' });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server executing cleanly on port ${PORT}`));
