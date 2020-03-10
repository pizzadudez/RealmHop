const RealmModel = require('../models/Realm');

exports.getAll = async (req, res, next) => {
  try {
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};
exports.connect = async (req, res, next) => {
  try {
    const test = RealmModel.connect(req.body);
    res.status(200).json(test);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};
exports.disconnect = async (req, res, next) => {
  try {
    RealmModel.disconnect(req.params.id);
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};
