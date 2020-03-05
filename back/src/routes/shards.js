const router = require('express').Router();
const controller = require('../controllers/shards');

router.get('/shards', controller.getAll);
router.post('/shard/:id/issues', controller.addIssue);
// router.post('/positions', realmsController.updatePositions);
// router.patch('/:id', realmsController.updateRealm);

module.exports = router;
