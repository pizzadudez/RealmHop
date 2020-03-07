const router = require('express').Router();
const controller = require('../controllers/shards');
const validate = require('../middlewares/validate');

router.get('/shards', controller.getAll);

// select, addIssue, updatePositions
router.post('/shards/select', validate('selectShards'), controller.select);
router.post(
  '/shards/positions',
  validate('updatePositions'),
  controller.updatePositions
);
router.post('/shard/:id/issues', validate('addIssue'), controller.addIssue);

// connect, disconnect
router.post('/shard/:id/connect', controller.connect);
router.delete('/shard/:id/disconnect', controller.disconnect);

module.exports = router;
