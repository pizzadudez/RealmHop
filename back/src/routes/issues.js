const router = require('express').Router();
const controller = require('../controllers/issues');

router.get('/', controller.getAll);

module.exports = router;
