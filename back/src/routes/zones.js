const router = require('express').Router();
const controller = require('../controllers/zones');

router.get('/', controller.getAll);

module.exports = router;
