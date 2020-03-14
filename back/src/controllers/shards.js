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
    const shardId = req.params.id;
    IssueModel.add(shardId, req.body);
    ShardModel.deselect(shardId);
    const updatedShard = ShardModel.getOne(shardId);
    res.status(200).json(updatedShard);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};
exports.selectOne = async (req, res, next) => {
  try {
    const data = {
      shard_ids: [req.params.id],
      insert_last: req.body.insert_last,
    };
    ShardModel.select(data);
    const updatedShard = ShardModel.getOne(req.params.id);
    res.status(200).json(updatedShard);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};
exports.selectMany = async (req, res, next) => {
  try {
    ShardModel.select(req.body);
    const shards = ShardModel.getAll();
    res.status(200).json(shards);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

exports.connect = async (req, res, next) => {
  try {
    ShardModel.connect(req.params.id, req.body);
    const updatedShard = ShardModel.getOne(req.params.id);
    res.status(200).json(updatedShard);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};
exports.disconnect = async (req, res, next) => {
  try {
    ShardModel.disconnect(req.params.id);
    const updatedShard = ShardModel.getOne(req.params.id);
    res.status(200).json(updatedShard);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

exports.updatePositions = async (req, res, next) => {
  try {
    ShardModel.updatePositions(req.body);
    const shards = ShardModel.getAll();
    res.status(200).json(shards);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};
