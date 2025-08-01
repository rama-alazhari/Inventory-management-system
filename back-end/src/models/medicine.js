const mongoose = require('mongoose')

const medicineSchema = new mongoose.Schema({
    drugName: {
        type: String,
        required: [true, "Provide Drug Name"],
    },
    companyName: {
        type: String,
        required: [true, "Provide Company Name"]
    },
    dosage: {
        type: Number,
    },
    typeofDrug: {
        type: String,
    },
    dateofProced: { //تاريخ الاجراء 
        type: Date,
        default: Date.now
    },
    dateofExpired: {
        type: Date,

    }
}
);

const Medicine = mongoose.model('Medicine', medicineSchema)


module.exports = Medicine