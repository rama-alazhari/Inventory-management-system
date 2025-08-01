const mongoose = require('mongoose')

const importAndExportSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, "Provide product name"],
    },
    storeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store',
        required: [true, "Provide store name"],
    },
    inputOrOutput:{
        type:String,
        enum: ["Import", "Export"],
        required: true
    },
    refNumber: {
        type: Number,
    },
    quantity: {
        type: Number,
        required: [true, "Provide enter quantity"],
    },
    placeProduct: {
        type: String
    },
    note:{
        type: String
    },
    productEntryOutDate: {
        type: Date,
        default: Date.now,
    },
}
);

const ImportExport = mongoose.model('ImportExport', importAndExportSchema)

module.exports = ImportExport