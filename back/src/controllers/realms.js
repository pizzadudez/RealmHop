const models = require('../models');

exports.getAll = async (req, res, next) => {
  try {
    const realms = await models.Realm.findAll({
      include: [
        { association: 'issues' }
      ],
      order: [['position', 'ASC']]
    });
    res.status(200).json(realms);
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

exports.updatePositions = async (req, res, next) => {
  try {

  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

exports.updateRealm = async (req, res, next) => {
  try {

  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

exports.addIssue = async (req, res, next) => {
  try {

  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};