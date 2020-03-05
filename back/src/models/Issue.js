const db = require('./db').db;

exports.getAll = () => {
  const issues = db.prepare(`SELECT * FROM issues`).all();
  return issues;
};

exports.add = (shardId, issueId) => {
  const add = db.prepare(`INSERT INTO shards_issues
    (shard_id, issue_id, created_at)
    VALUES (?, ?, ?)`);
  const values = [shardId, issueId, new Date().toISOString()];
  add.run(values);
};
