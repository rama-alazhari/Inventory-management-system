const express = require('express');
const router = express.Router();
const StoreModel = require('../models/store');
const auth = require('../middleware/verifyToken');

////////////////post store/////////////////////////////////
router.post('/store', auth  , async (req, res) => {
    try {
        const store = new StoreModel(req.body)
        await store.save();
        res.status(200).send(store);
    }
    catch (e) {
        res.status(400).send(e.message)
    }
})
/////////////////get all store//////////////////////////////////////
router.get('/store', auth  , async (req, res) => {
    try {
        const jops = await StoreModel.find({});
        res.status(200).send(jops);
    } catch (error) {
        res.status(400).send(error.message);
    }
})
////////////store count//////////////////////////////////
router.get('/store/count',auth  , async (req, res) => {
    try {
        const storeCount = await StoreModel.countDocuments(); 
        res.status(200).json({ count: storeCount });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch store count",
            error: error.message,
        });
    }
});
///////////get store by id/////////////////////////////////
router.get('/store/:id', auth  , async (req, res) => {
    try {
        const store = await StoreModel.findById(req.params.id);
        if (!store) {
            return res.status(404).send('Unable to find store');
        }
        res.status(200).send(store);
    } catch (error) {
        res.status(400).send(error.message);
    }
});
///////////patch store by id ////////////////////////////////////
router.patch('/store/:id', auth  , async (req, res) => {
    try {
        const _id = req.params.id;
        const store = await StoreModel.findByIdAndUpdate({ _id }, req.body, { new: true, runValidators: true })
        if (!store) {
            res.status(404).send('no store')
        }
        res.status(200).send(store)
    }
    catch (error) {
        res.status(400).send(error.message);
    }
})
//////////delte store by id////////////////
router.delete('/store/:id', auth  , async (req, res) => {  
    try {  
        const store = await StoreModel.findByIdAndDelete(req.params.id);  
        if (!store) {  
            return res.status(404).send('Unable to find store');  
        }  
        res.status(200).send(store);  
    } catch (error) {  
        res.status(400).send(error.message);  
    }  
}); 


module.exports=router
