const router = require('express').Router();
const ShardsRouter = require('./shards');
const ZonesRouter = require('./zones');

router.use('/', ShardsRouter);
router.use('/zones', ZonesRouter);

module.exports = router;
