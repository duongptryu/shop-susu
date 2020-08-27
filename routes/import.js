const express = require("express");
const controller = require("../controller/product");


const router = express.Router();


router.get('/add-product', controller.getAddProductPage);

router.get('/', controller.getDisplayPage);

router.post('/addProductImport', controller.addProductImport);

router.get('/getByDate', controller.getDataByDate);

router.get('/update/:id', controller.getUpdatePage);

router.post('/update', controller.updateDataImport);

router.get('/delete/:id', controller.deleteData);


module.exports = router;
