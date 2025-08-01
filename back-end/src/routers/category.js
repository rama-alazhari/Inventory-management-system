const express = require('express');
const router = express.Router();
const CategoryModel = require('../models/category');
const ProductModel = require('../models/product');
const auth = require('../middleware/verifyToken');

////////////////post category/////////////////////////////////
router.post('/category', auth, async (req, res) => {
    try {
        const category = new CategoryModel(req.body)
        await category.save();
        res.status(200).send(category);
    }
    catch (e) {
        res.status(400).send(e.message)
    }
})
/////////////////get all category//////////////////////////////////////
router.get('/category', auth, async (req, res) => {
    try {
        const jops = await CategoryModel.find({});
        res.status(200).send(jops);
    } catch (error) {
        res.status(400).send(error.message);
    }
})
////////////category count//////////////////////////////////
router.get('/category/count', auth, async (req, res) => {
    try {
        const categoryCount = await CategoryModel.countDocuments();
        res.status(200).json({ count: categoryCount });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch category count",
            error: error.message,
        });
    }
});
///////////get category by id/////////////////////////////////
router.get('/category/:id', auth, async (req, res) => {
    try {
        const category = await CategoryModel.findById(req.params.id);
        if (!category) {
            return res.status(404).send('Unable to find category');
        }
        res.status(200).send(category);
    } catch (error) {
        res.status(400).send(error.message);
    }
});
///////////patch category by id ////////////////////////////////////
router.patch('/category/:id', auth, async (req, res) => {
    try {
        const _id = req.params.id;
        const category = await CategoryModel.findByIdAndUpdate({ _id }, req.body, { new: true, runValidators: true })
        if (!category) {
            res.status(404).send('no category')
        }
        res.status(200).send(category)
    }
    catch (error) {
        res.status(400).send(error.message);
    }
})
//////////delte category by id////////////////
router.delete('/category/:id', auth, async (req, res) => {
    try {
        // تحديث المنتجات المرتبطة بالفئة  
        await ProductModel.updateMany({ category: req.params.id }, { $unset: { category: "" } });

        const category = await CategoryModel.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).send('Unable to find category');
        }
        res.status(200).send(category);
    } catch (error) {
        res.status(400).send(error.message);
    }
});


module.exports = router
