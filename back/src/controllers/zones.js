const ZoneModel = require('../models/Zone');
const SettingModel = require('../models/Setting');

exports.getAll = async (req, res, next) => {
  try {
    const zones = ZoneModel.getAll();
    res.status(200).json(zones);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};
exports.setActiveZone = async (req, res, next) => {
  try {
    SettingModel.change({ name: 'selected_zone', value: req.params.id });
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};
