const router = require('express').Router();
const realmsController = require('../controllers/realms')

router.get('/', realmsController.getAll);
router.post('/positions', realmsController.updatePositions);
router.patch('/:id', realmsController.updateRealm);
router.post('/:id/issues', realmsController.addIssue);

module.exports = router;