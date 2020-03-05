const router = require('express').Router();
const shardsRouter = require('./shards');
const zonesRouter = require('./zones');
const issuesRouter = require('./issues');

router.use('/', shardsRouter);
router.use('/zones', zonesRouter);
router.use('/issues', issuesRouter);

module.exports = router;
