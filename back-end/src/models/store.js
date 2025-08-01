const mongoose = require ('mongoose')

const storeSchema = new mongoose.Schema ( {
    storename : {
        type: String,
        required :  [true,"Provide Uert Name"],
    },
    location : {
        type: String,
        required: [true,"Provide Location"]
    },
    inventory: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, default: 0 }  // كمية المنتج في المخزن
    }]
 }
);

const Store = mongoose.model( 'Store' , storeSchema  )


module.exports = Store