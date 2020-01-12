const router = require('express').Router();
const RealmsRouter = require('./realms');

router.use('/realms', RealmsRouter);

module.exports = router;