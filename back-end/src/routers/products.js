const express = require ('express')
const ProductModel = require('../models/product')
const router = express.Router()
const auth = require('../middleware/verifyToken')
const multer=require('multer')

const storage = multer.diskStorage({
    destination: (req,file,callback)=>{
        callback(null, "../front-end/public/uploads/");
    },
    filename: (req,file,callback)=>{
   callback(null,file.originalname)
    }
});
const upload=multer({storage:storage})

///////post products/////////////////////////
router.post('/products',auth  , upload.single("image"), async (req, res) => {  
    try {  
        const { productName, price, productHistory, productEntryDate, category ,serialNumber } = req.body;

        if (!category) {
            return res.status(400).send("products is required!");
        }

        const products = new ProductModel({  
            productName,  
            price,  
            productHistory,  
            productEntryDate,  
            serialNumber,
            image: req.file ? req.file.originalname : null,
            category  
        });

        await products.save();  
        res.status(200).send("New product posted!");  
    } catch (error) {  
        res.status(400).send(error.message);  
    }  
});
///////////get products/////////////////////////////
router.get('/products', auth  ,async (req, res) => {  
    try {  
        const products = await ProductModel.find({}).populate('category', 'categoryName');  
        res.status(200).send(products);  
    } catch (error) {  
        res.status(400).send(error.message);  
    }  
});
  ////////////products count//////////////////////////////////
router.get('/products/count',auth  , async (req, res) => {
    try {
        const productsCount = await ProductModel.countDocuments(); 
        res.status(200).json({ count: productsCount });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch products count",
            error: error.message,
        });
    }
});
///////////get products by id/////////////////////////////////
router.get('/products/:id', auth  , async (req, res) => {  
    try {  
        const products = await ProductModel.findById(req.params.id).populate('category', 'categoryName');  
        if (!products) {  
            return res.status(404).send('Unable to find products');  
        }  
        res.status(200).send(products);  
    } catch (error) {  
        res.status(400).send(error.message);  
    }  
});  
////////////patch products by id////////////////////////////////
router.patch('/products/:id', auth  , upload.single("image"), async (req, res) => {  
    try {  
        const _id = req.params.id;  
        const products = await ProductModel.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true });  
        if (!products) {  
            return res.status(404).send('Unable to find products');  
        }  
        if (req.file) {  
            products.image = req.file.originalname;  
        }  
        products.productName = req.body.productName;  
        products.price = req.body.price;  
        products.productHistory = req.body.productHistory;  
        products.productEntryDate = req.body.productEntryDate;  
        products.category = req.body.category;  
        products.serialNumber = req.body.serialNumber;  

        await products.save();  
        res.status(200).send(products);  
    } catch (error) {  
        res.status(400).send(error.message);  
    }  
});
//////////delte products by id////////////////
router.delete('/products/:id', auth  , async (req, res) => {  
    try {  
        const products = await ProductModel.findByIdAndDelete(req.params.id);  
        if (!products) {  
            return res.status(404).send('Unable to find products');  
        }  
        res.status(200).send(products);  
    } catch (error) {  
        res.status(400).send(error.message);  
    }  
});  

module.exports=router
 