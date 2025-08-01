const mongoose = require ('mongoose')

const categorySchema = new mongoose.Schema ( {
    categoryName : {
        type: String,
        required :  [true,"Provide Category Name"],
    },
 }
);

const Category = mongoose.model( 'Category' , categorySchema)


module.exports = Category