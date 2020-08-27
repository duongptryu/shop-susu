const express = require("express");
const controller = require("../controller/product");
const requestAuth = require("../middleware/auth.midleware");

const router = express.Router();


router.get('/add-product', controller.getAddProductPage);

router.get('/', controller.getDisplayPage);

router.post('/addProductExport', controller.addProductExport);

router.get('/getByDate', controller.getDataByDate);

router.get('/update/:id', controller.getUpdatePage);

router.post('/update', controller.updateDataExport);

router.get('/delete/:id', controller.deleteData);


module.exports = router;
