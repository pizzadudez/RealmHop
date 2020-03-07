const router = require('express').Router();
const controller = require('../controllers/shards');
const validate = require('../middlewares/validate');

router.get('/shards', controller.getAll);

// select, addIssue, updatePositions
router.post('/shard/:id/issues', validate('addIssue'), controller.addIssue);
router.post('/shard/:id/select', validate('selectShard'), controller.selectOne);
router.post('/shards/select', validate('selectShards'), controller.selectMany);
router.post(
  '/shards/positions',
  validate('updatePositions'),
  controller.updatePositions
);

// connect, disconnect
router.post('/shard/:id/connect', controller.connect);
router.delete('/shard/:id/disconnect', controller.disconnect);

module.exports = router;
