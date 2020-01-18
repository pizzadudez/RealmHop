const router = require('express').Router();
const issuesController = require('../controllers/issues');

router.get('/', issuesController.getAll);

module.exports = router;