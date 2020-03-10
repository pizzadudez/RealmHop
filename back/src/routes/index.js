const router = require('express').Router();
const shardsRouter = require('./shards');
const zonesRouter = require('./zones');
const issuesRouter = require('./issues');
const realmsRouter = require('./realms');

router.use('/', shardsRouter);
router.use('/zones', zonesRouter);
router.use('/issues', issuesRouter);
router.use('/', realmsRouter);

module.exports = router;
