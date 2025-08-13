const express = require('express');
const router = express.Router();
const { createHelp, getNearbyHelp, acceptHelp } = require('../controllers/helpController');
const auth = require('../middleware/authMiddleware');

router.post('/create', auth, createHelp);
router.get('/nearby', auth, getNearbyHelp);
router.post('/accept/:id', auth, acceptHelp);


module.exports = router;
