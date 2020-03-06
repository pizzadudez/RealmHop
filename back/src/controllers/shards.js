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
    IssueModel.add(req.params.id, req.body);
    ShardModel.deselect(req.params.id);
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};
exports.select = async (req, res, next) => {
  try {
    ShardModel.select(req.body);
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};
exports.updatePositions = async (req, res, next) => {
  try {
    ShardModel.updatePositions(req.body);
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};
exports.connect = async (req, res, next) => {
  try {
    IssueModel.add(req.params.id, { connect: true });
    ShardModel.connect(req.params.id, req.body);
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};
exports.disconnect = async (req, res, next) => {
  try {
    ShardModel.disconnect(req.params.id);
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};
