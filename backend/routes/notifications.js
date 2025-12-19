const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getUserNotifications, markRead } = require('../controllers/notificationController');

router.get('/', auth, getUserNotifications);
router.post('/:id/mark-read', auth, markRead);

module.exports = router;
