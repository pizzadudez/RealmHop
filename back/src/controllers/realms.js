const RealmModel = require('../models/Realm');

exports.getAll = async (req, res, next) => {
  try {
    const realmsById = RealmModel.getAll();
    res.status(200).json(realmsById);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};
exports.getGroups = async (req, res, next) => {
  try {
    const groupsById = RealmModel.getGroups();
    res.status(200).json(groupsById);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};
exports.connect = async (req, res, next) => {
  try {
    RealmModel.connect(req.body);
    res.sendStatus(200);
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
