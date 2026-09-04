import express from 'express';
import Product from '../models/Product.js';
const router = express.Router();
router.get('/', async (req, res) => {
    try {
        const products = await Product.find().sort({ name: 1 });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving market index', error: error.message });
    }
});
router.post('/', async (req, res) => {
    const { name, category, unitOfMeasurement, newPrice, market, vendorName, reportedBy } = req.body;
    try {
        let product = await Product.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
        if (!product) {
            if (!category || !unitOfMeasurement) {
                return res.status(400).json({ message: 'Category and unit are required for new commodities.' });
            }
            product = new Product({ name, category, unitOfMeasurement });
        }
        if (newPrice && market) {
            product.priceHistory.push({ price: Number(newPrice), market, vendorName, reportedBy });
        }
        await product.save();
        res.status(201).json({ message: 'Market data submitted successfully!', product });
    } catch (error) {
        res.status(400).json({ message: 'Failed to process submission', error: error.message });
    }
});
export default router;
