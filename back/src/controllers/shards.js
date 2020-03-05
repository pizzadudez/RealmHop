const ShardModel = require('../models/Shard');
const IssueModel = require('../models/Issue');

exports.getAll = async (req, res, next) => {
  try {
    const shards = ShardModel.getAll();
    res.status(200).json(shards);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

exports.addIssue = async (req, res, next) => {
  try {
    IssueModel.add(req.params.id, req.body.issue_id);
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};
