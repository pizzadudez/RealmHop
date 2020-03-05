const ZoneModel = require('../models/Zone');

exports.getAll = async (req, res, next) => {
  try {
    const zones = ZoneModel.getAll();
    res.status(200).json(zones);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};
