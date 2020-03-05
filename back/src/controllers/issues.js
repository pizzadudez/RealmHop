const IssueModel = require('../models/Issue');

exports.getAll = async (req, res, next) => {
  try {
    const issues = IssueModel.getAll();
    res.status(200).json(issues);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};
