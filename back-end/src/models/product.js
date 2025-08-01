const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    image: {
        type: String,
        required: [true, "Provide image product"],
    },
    productName: {
        type: String,
        required: [true, "Provide product name"],
    },
    price: {
        type: Number,
        required: [true, "Provide product price"],
    },
    productHistory: {
        type: Date,
    },
    productEntryDate: {
        type: Date,
        default: Date.now,
    },
    serialNumber:{
        type:Number,
        default : 0
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,  // ربط المنتج بفئة عبر الـ ID
        ref: 'Category', 
        required: [true, "Provide product category"],
    }
}
);

const Product = mongoose.model('Product', productSchema)

module.exports = Product