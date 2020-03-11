const db = require('./db').db;

exports.getAll = () => {
  const realms = db.prepare(`SELECT * FROM realms`).all();
  return Object.fromEntries(realms.map(realm => [realm.id, realm]));
};
exports.getGroups = () => {
  const groups = db
    .prepare(
      `SELECT DISTINCT group_id AS id, 
    group_concat(id) OVER(
      PARTITION BY group_id
      ROWS BETWEEN UNBOUNDED PRECEDING 
      AND UNBOUNDED FOLLOWING
    ) AS realm_ids
    FROM realms WHERE group_id NOT NULL`
    )
    .all();
  return Object.fromEntries(
    groups.map(group => {
      const realmIds = group.realm_ids.split(',').map(Number);
      return [group.id, realmIds];
    })
  );
};
exports.getOne = id => {
  return db.prepare(`SELECT * FROM realms WHERE id=?`).get(id);
};
exports.connect = ({ first, second }) => {
  const createConnection = db.prepare(
    `INSERT OR IGNORE INTO realm_connections
    (first, second, created_at)
    VALUES (@first, @second, @timestamp)`
  );
  createConnection.run({ first, second, timestamp: new Date().toISOString() });

  // Handle connection side effects
  const firstGroup = exports.getOne(first).group_id;
  const secondGroup = exports.getOne(second).group_id;
  let realmIds = [first, second];
  let groupId;
  if (firstGroup && secondGroup) {
    // Both in groups => merge groups
    groupId = Math.min(firstGroup, secondGroup);
    realmIds = getGroupIds(groupId === firstGroup ? secondGroup : firstGroup);
  } else if (!firstGroup && !secondGroup) {
    // Both not in groups => create new group
    groupId = getMaxGroupId() + 1;
  } else {
    // One in group => add the other
    groupId = firstGroup || secondGroup;
  }
  updateGroupIds(realmIds, groupId);
};
// Remove realm from it's realm_group
exports.disconnect = id => {
  db.prepare(
    `DELETE FROM realm_connections WHERE
    first=@id OR second=@id`
  ).run({ id });
  db.prepare(`UPDATE realms SET group_id=NULL WHERE id=?`).run(id);
};

// Helpers
const getGroupIds = id => {
  return db
    .prepare(`SELECT id FROM realms WHERE group_id=?`)
    .pluck()
    .all(id);
};
const updateGroupIds = (realmIds, groupId) => {
  const update = db.prepare(`UPDATE realms SET group_id=@groupId WHERE id=@id`);
  const updateMany = db.transaction(ids =>
    ids.forEach(id => update.run({ id, groupId }))
  );
  updateMany(realmIds);
};
const getMaxGroupId = () => {
  const id = db
    .prepare(`SELECT MAX(group_id) FROM realms`)
    .pluck()
    .get();
  return id || 0;
};
