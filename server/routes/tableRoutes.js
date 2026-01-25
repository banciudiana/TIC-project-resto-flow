const express = require('express');
const router = express.Router();
const { getTableConfig, updateTableConfig } = require('../controllers/tableController');
const { validateToken, isOwner } = require('../middleware/authMiddleware');


router.get('/config', validateToken, getTableConfig);

router.post('/config', validateToken, isOwner, updateTableConfig);
router.put('/config', validateToken, isOwner, updateTableConfig);

module.exports = router;