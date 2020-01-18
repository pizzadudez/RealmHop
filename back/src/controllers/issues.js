const models = require('../models');

exports.getAll = async (req, res, next) => {
  try {
    const issues = await models.Issue.findAll();
    res.status(200).json(issues);
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};