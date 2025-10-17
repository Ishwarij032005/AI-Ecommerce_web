const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/chat', aiController.chat);
router.get('/recommendations/:productId?', authMiddleware, aiController.recommendations);
router.get('/projection', aiController.projection);

module.exports = router;
