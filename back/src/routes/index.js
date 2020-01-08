const router = require('express').Router();
const realmsController = require('../controllers/realms')

router.route('/realms')
  .get(realmsController.getAll)

module.exports = router;