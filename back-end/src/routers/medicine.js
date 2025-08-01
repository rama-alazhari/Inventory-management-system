const express = require('express');
const router = express.Router();
const MedicineModel = require('../models/medicine');
const auth = require('../middleware/verifyToken');

////////////////post medicine/////////////////////////////////
router.post('/medicine', auth  , async (req, res) => {
    try {
        const medicine = new MedicineModel(req.body)
        await medicine.save();
        res.status(200).send(medicine);
    }
    catch (e) {
        res.status(400).send(e.message)
    }
})
/////////////////get all medicine//////////////////////////////////////
router.get('/medicine', auth  , async (req, res) => {
    try {
        const medicine = await MedicineModel.find({});
        res.status(200).send(medicine);
    } catch (error) {
        res.status(400).send(error.message);
    }
})
////////////medicine count//////////////////////////////////
router.get('/medicine/count',auth  , async (req, res) => {
    try {
        const medicineCount = await MedicineModel.countDocuments(); 
        res.status(200).json({ count: medicineCount });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch medicine count",
            error: error.message,
        });
    }
});
///////////get medicine by id/////////////////////////////////
router.get('/medicine/:id', auth  , async (req, res) => {
    try {
        const medicine = await MedicineModel.findById(req.params.id);
        if (!medicine) {
            return res.status(404).send('Unable to find medicine');
        }
        res.status(200).send(medicine);
    } catch (error) {
        res.status(400).send(error.message);
    }
});
///////////patch medicine by id ////////////////////////////////////
router.patch('/medicine/:id', auth  , async (req, res) => {
    try {
        const _id = req.params.id;
        const medicine = await MedicineModel.findByIdAndUpdate({ _id }, req.body, { new: true, runValidators: true })
        if (!medicine) {
            res.status(404).send('no medicine')
        }
        res.status(200).send(medicine)
    }
    catch (error) {
        res.status(400).send(error.message);
    }
})
//////////delte medicine by id////////////////
router.delete('/medicine/:id', auth  , async (req, res) => {  
    try {  
        const medicine = await MedicineModel.findByIdAndDelete(req.params.id);  
        if (!medicine) {  
            return res.status(404).send('Unable to find medicine');  
        }  
        res.status(200).send(medicine);  
    } catch (error) {  
        res.status(400).send(error.message);  
    }  
}); 


module.exports=router
