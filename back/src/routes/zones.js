const router = require('express').Router();
const controller = require('../controllers/zones');

router.get('/', controller.getAll);
router.post('/:id/active', controller.setActiveZone);

module.exports = router;
