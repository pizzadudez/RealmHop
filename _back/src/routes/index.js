const router = require('express').Router();
const RealmsRouter = require('./realms');
const IssuesRouter = require('./issues');

router.use('/realms', RealmsRouter);
router.use('/issues', IssuesRouter);

module.exports = router;