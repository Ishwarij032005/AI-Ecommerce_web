const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', productController.list);
router.get('/:id', productController.get);

router.post('/', authMiddleware, adminMiddleware, upload.array('images', 6), productController.create);
router.put('/:id', authMiddleware, adminMiddleware, upload.array('images', 6), productController.update);
router.delete('/:id', authMiddleware, adminMiddleware, productController.remove);

module.exports = router;
