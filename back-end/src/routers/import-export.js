const express = require('express');
const router = express.Router();
const ImportAndExport = require('../models/import-export');
const Store = require('../models/store');
const auth = require('../middleware/verifyToken');

////////////////post import-export/////////////////////////////////
router.post('/import-export', auth  ,async (req, res) => {
    try {
        const { productId, storeId, inputOrOutput, quantity, refNumber, placeProduct, note, productEntryOutDate } = req.body;

        const store = await Store.findById(storeId);
        if (!store) return res.status(404).json({ message: "Store not found" });

        let productIndex = store.inventory.findIndex(item => item.productId.toString() === productId);
        const numericQuantity = Number(quantity); // تحويل الكمية إلى رقم

        if (isNaN(numericQuantity) || numericQuantity <= 0) {
            return res.status(400).json({ message: "Invalid quantity value" });
        }

        if (inputOrOutput === "Import") {
            if (productIndex !== -1) {
                store.inventory[productIndex].quantity = Number(store.inventory[productIndex].quantity) + numericQuantity;  
            } else {
                store.inventory.push({ productId, quantity: numericQuantity });  
            }
        } 
        else if (inputOrOutput === "Export") {
            if (productIndex === -1 || store.inventory[productIndex].quantity < numericQuantity) {
                return res.status(400).json({ message: "Not enough stock to export" });
            }
            store.inventory[productIndex].quantity -= numericQuantity;  
        }

        await store.save();

        const importExport = new ImportAndExport({
            productId,
            storeId,
            inputOrOutput,
            quantity,
            refNumber,
            placeProduct,
            note,
            productEntryOutDate: productEntryOutDate || Date.now() // تعيين التاريخ الحالي إذا لم يتم إدخاله
        });

        await importExport.save();

        res.status(200).json({ message: "Transaction successful", importExport });
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
});
/////عرض تقرير الكميات في المخازن 
router.get('/store/:id/inventory',auth  , async (req, res) => {
    try {
        const store = await Store.findById(req.params.id).populate("inventory.productId");
        if (!store) return res.status(404).json({ message: "Store not found" });

        res.status(200).json(store.inventory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
// router.get('/store/:id/inventory', auth, async (req, res) => {
//     try {
//         const inventory = await ImportAndExport.find({ storeId: req.params.id })
//             .populate({ path: "productId", select: "productName serialNumber image" });

//         if (!inventory || inventory.length === 0) {
//             return res.status(404).json({ message: "No products found in this store" });
//         }

//         console.log("Fetched Inventory:", inventory);  // ✅ تحقق أن البيانات تحتوي على placeProduct
//         res.status(200).json(inventory);
//     } catch (error) {
//         console.error("Error fetching inventory:", error);
//         res.status(500).json({ message: "Server error" });
//     }
// });

/////////////////get all import-export//////////////////////////////////////
router.get('/import-export', auth  , async (req, res) => {
    try {
        const jops = await ImportAndExport.find({}).populate('productId', 'productName').populate('storeId' ,'storename');
        res.status(200).send(jops);
    } catch (error) {
        res.status(400).send(error.message);
    }
})
////////////import-export count//////////////////////////////////
// حساب عدد المدخلات والمخرجات
router.get('/import-export/all', auth, async (req, res) => {  
    try {  
        const allRecords = await ImportAndExport.find(); // جلب كل البيانات من القاعدة
        res.status(200).json({ data: allRecords });  
    } catch (error) {  
        console.error("Error fetching data:", error);
        res.status(500).json({ message: "Failed to fetch data", error: error.message });
    }  
});

// حساب عدد المدخلات والمخرجات بناءً على اليوم، الشهر، والسنة
// router.get('/import-export/count', auth, async (req, res) => {  
//     try {  
//         // ضبط التوقيت على دبي (UTC+4)
//         const now = moment().tz("Asia/Dubai");

//         // بداية اليوم
//         const startOfDay = now.clone().startOf('day').toDate();
//         const endOfDay = now.clone().endOf('day').toDate();

//         // بداية الشهر
//         const startOfMonth = now.clone().startOf('month').toDate();
//         const endOfMonth = now.clone().endOf('month').toDate();

//         // بداية السنة
//         const startOfYear = now.clone().startOf('year').toDate();
//         const endOfYear = now.clone().endOf('year').toDate();

//         console.log("Start of Day UAE:", startOfDay);
//         console.log("End of Day UAE:", endOfDay);
//         console.log("Start of Month UAE:", startOfMonth);
//         console.log("End of Month UAE:", endOfMonth);
//         console.log("Start of Year UAE:", startOfYear);
//         console.log("End of Year UAE:", endOfYear);

//         // حساب المدخلات (Import)
//         const dailyImport = await ImportAndExport.countDocuments({  
//             inputOrOutput: 'Import',  
//             createdAt: { $gte: startOfDay, $lt: endOfDay }  
//         });  

//         const monthlyImport = await ImportAndExport.countDocuments({  
//             inputOrOutput: 'Import',  
//             createdAt: { $gte: startOfMonth, $lt: endOfMonth }  
//         });  

//         const yearlyImport = await ImportAndExport.countDocuments({  
//             inputOrOutput: 'Import',  
//             createdAt: { $gte: startOfYear, $lt: endOfYear }  
//         });  

//         // حساب المخرجات (Export)
//         const dailyExport = await ImportAndExport.countDocuments({  
//             inputOrOutput: 'Export',  
//             createdAt: { $gte: startOfDay, $lt: endOfDay }  
//         });  

//         const monthlyExport = await ImportAndExport.countDocuments({  
//             inputOrOutput: 'Export',  
//             createdAt: { $gte: startOfMonth, $lt: endOfMonth }  
//         });  

//         const yearlyExport = await ImportAndExport.countDocuments({  
//             inputOrOutput: 'Export',  
//             createdAt: { $gte: startOfYear, $lt: endOfYear }  
//         });  

//         res.status(200).json({  
//             dailyImport,  
//             monthlyImport,  
//             yearlyImport,  
//             dailyExport,  
//             monthlyExport,  
//             yearlyExport  
//         });  

//     } catch (error) {  
//         console.error("Error fetching import/export summary:", error);
//         res.status(500).json({  
//             message: "Failed to fetch import/export summary",  
//             error: error.message  
//         });  
//     }  
// });    
///////////get import-export by id/////////////////////////////////
router.get('/import-export/:id',auth  ,  async (req, res) => {
    try {
        const importExport = await ImportAndExport.findById(req.params.id).populate('productId', 'productName').populate('storeId' ,'storename');
        if (!importExport) {
            return res.status(404).send('Unable to find importExport');
        }
        res.status(200).send(importExport);
    } catch (error) {
        res.status(400).send(error.message);
    }
});
///////////patch import-export by id ////////////////////////////////////
router.patch('/import-export/:id', auth, async (req, res) => {
    try {
      const importExportId = req.params.id;
      const updatedData = req.body;
  
      // Step 1: Get the existing import/export record
      const existingRecord = await ImportAndExport.findById(importExportId);
      if (!existingRecord) return res.status(404).send("Record not found");
  
      // Step 2: Get the store and find the product in inventory
      const store = await Store.findById(existingRecord.storeId);
      if (!store) return res.status(404).send("Store not found");
  
      const inventoryItem = store.inventory.find(item =>
        item.productId.toString() === existingRecord.productId.toString()
      );
  
      if (!inventoryItem) return res.status(404).send("Product not found in inventory");
  
      // Step 3: Reverse the old operation to "reset" inventory
      if (existingRecord.inputOrOutput === "Import") {
        inventoryItem.quantity -= existingRecord.quantity;
      } else if (existingRecord.inputOrOutput === "Export") {
        inventoryItem.quantity += existingRecord.quantity;
      }
  
      // Step 4: Apply the new operation
      if (updatedData.inputOrOutput === "Import") {
        inventoryItem.quantity += Number(updatedData.quantity);
      } else if (updatedData.inputOrOutput === "Export") {
        inventoryItem.quantity -= Number(updatedData.quantity);
      }
  
      // Step 5: Save store inventory
      await store.save();
  
      // Step 6: Update the import-export record
      const updatedImportExport = await ImportAndExport.findByIdAndUpdate(
        importExportId,
        updatedData,
        { new: true, runValidators: true }
      );
  
      res.status(200).send(updatedImportExport);
    } catch (error) {
      console.error(error);
      res.status(400).send(error.message);
    }
  });
  
//////////delte import-export by id////////////////
router.delete('/import-export/:id', auth  ,async (req, res) => {  
    try {  
        // 1️⃣ جلب بيانات العملية قبل حذفها
        const importExport = await ImportAndExport.findById(req.params.id);
        if (!importExport) {
            return res.status(404).json({ message: 'Unable to find importExport' });
        }

        const { productId, storeId, inputOrOutput, quantity } = importExport;
        const numericQuantity = Number(quantity); // تأكد من أن الكمية رقم وليس نص

        if (isNaN(numericQuantity) || numericQuantity <= 0) {
            return res.status(400).json({ message: "Invalid quantity value" });
        }

        // 2️⃣ العثور على المخزن المرتبط بهذه العملية
        const store = await Store.findById(storeId);
        if (!store) {  
            // عند عدم وجود المخزن، يمكنك اختيار ما تفعله هنا.  
            // يمكنك حذف العملية مباشرةً إذا كنت تريد، أو إرجاع خطأ.  
            await ImportAndExport.findByIdAndDelete(req.params.id);  
            return res.status(200).json({ message: "Import/Export deleted, but store not found", storeId });  
        }  

        // 3️⃣ البحث عن المنتج داخل المخزن
        let productIndex = store.inventory.findIndex(item => item.productId.toString() === productId.toString());

        console.log("Product Index:", productIndex);

        if (productIndex !== -1) {
            if (inputOrOutput === "Import") {
                // عند حذف عملية استيراد، يتم طرح الكمية من المخزن
                store.inventory[productIndex].quantity = Math.max(0, Number(store.inventory[productIndex].quantity) - numericQuantity);
            } else if (inputOrOutput === "Export") {
                // عند حذف عملية تصدير، يتم إعادة الكمية إلى المخزن
                store.inventory[productIndex].quantity += numericQuantity;
            }
        } else {
            return res.status(400).json({ message: "Product not found in inventory" });
        }

        // 4️⃣ حفظ تحديثات المخزن
        await store.save();

        // 5️⃣ حذف عملية الاستيراد/التصدير بعد تحديث المخزن
        await ImportAndExport.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: "Transaction deleted and inventory updated", store });

    } catch (error) {  
        console.error("Error deleting import-export transaction:", error);
        res.status(400).json({ message: error.message });  
    }  
});


module.exports=router
