const router = require('express').Router();
const controller = require('../controllers/realms');
const validate = require('../middlewares/validate');

// get realms
router.get('/realms', controller.getAll);
// get groups ????

// Create connection between two realms
router.post(
  '/realms/connections',
  validate('realmConnection'),
  controller.connect
);
// Delete a realm's connections and group membership
router.delete('/realm/:id/connections/', controller.disconnect);

module.exports = router;
