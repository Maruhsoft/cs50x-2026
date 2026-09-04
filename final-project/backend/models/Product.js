import mongoose from 'mongoose';
const priceLogSchema = new mongoose.Schema({
    price: { type: Number, required: true },
    market: { type: String, required: true, enum: ['Wuse Market', 'Utako Market', 'Garki Market', 'Mararaba Market', 'Bwari Market'] },
    vendorName: { type: String, default: 'Independent Vendor' },
    reportedBy: { type: String, default: 'Anonymous Guest' },
    createdAt: { type: Date, default: Date.now }
});
const productSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, trim: true },
    category: { type: String, required: true, enum: ['Grains', 'Tubers', 'Vegetables', 'Oils', 'Livestock', 'Other'] },
    unitOfMeasurement: { type: String, required: true },
    imageUrl: { type: String, default: '' },
    priceHistory: [priceLogSchema]
}, { timestamps: true });
productSchema.virtual('averagePrice').get(function() {
    if (this.priceHistory.length === 0) return 0;
    const sum = this.priceHistory.reduce((acc, curr) => acc + curr.price, 0);
    return Math.round(sum / this.priceHistory.length);
});
productSchema.set('toJSON', { virtuals: true });
export default mongoose.model('Product', productSchema);
