const db = require('./db').db;

exports.getAll = () => {
  return db.prepare(`SELECT * FROM issues WHERE id!=1`).all();
};

exports.add = (shardId, { issue_id: issueId, connect = false }) => {
  const add = db.prepare(`INSERT INTO shards_issues
    (shard_id, issue_id, created_at)
    VALUES (@shardId, @issueId, @timestamp)`);
  add.run({
    shardId,
    issueId: connect ? 1 : issueId,
    timestamp: new Date().toISOString(),
  });
};
