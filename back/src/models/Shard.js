const db = require('./db').db;

exports.getAll = () => {
  const zones = db.prepare(`SELECT * from zones`).all();
  const zonesById = Object.fromEntries(zones.map(z => [z.id, z]));
  const realms = db.prepare(`SELECT * from realms`).all();
  const realmsById = Object.fromEntries(realms.map(r => [r.id, r]));

  const shards = db
    .prepare(
      `SELECT id, selected, position, zone_id AS zone,
      realm_id AS realm, connected_to FROM shards`
    )
    .all();
  const shardsById = Object.fromEntries(
    shards.map(s => [
      s.id,
      {
        ...s,
        zone: zonesById[s.zone],
        realm: realmsById[s.realm],
        issues: [],
      },
    ])
  );
  // Add connected_with array on 'parent' shard of shard group
  shards.forEach(s => {
    const parentId = s.connected_to;
    if (parentId) {
      shardsById[parentId].connected_with = [
        ...(shardsById[parentId].connected_with || []),
        s.id,
      ];
    }
  });
  // Add issues
  const issues = db
    .prepare(
      `SELECT * FROM shards_issues si
      LEFT JOIN issues i ON i.id = si.issue_id
      ORDER BY created_at DESC`
    )
    .all();
  issues.forEach(i =>
    shardsById[i.shard_id].issues.push({
      id: i.id,
      type: i.name,
      description: i.description,
      color: i.color,
      created_at: i.created_at,
    })
  );

  return shardsById;
};
exports.getOne = id => {
  const shard = db
    .prepare(
      `SELECT id, selected, position, zone_id AS zone,
      realm_id AS realm, connected_to FROM shards WHERE id=?`
    )
    .get(id);
  const zone = db.prepare(`SELECT * from zones WHERE id=?`).get(shard.zone);
  const realm = db.prepare(`SELECT * from realms WHERE id=?`).get(shard.realm);
  const connectedWith = db
    .prepare(`SELECT id from shards WHERE connected_to=?`)
    .pluck()
    .all(id);
  const issues = db
    .prepare(
      `SELECT * FROM shards_issues si
      LEFT JOIN issues i ON i.id = si.issue_id 
      WHERE si.shard_id=?
      ORDER BY created_at DESC`
    )
    .all(shard.id);
  // Add issues
  shard.issues = [];
  issues.forEach(i =>
    shard.issues.push({
      id: i.id,
      type: i.name,
      description: i.description,
      color: i.color,
      created_at: i.created_at,
    })
  );
  return {
    ...shard,
    realm,
    zone,
    ...(connectedWith.length && { connected_with: connectedWith }),
  };
};
// Select 1 or multiple shards
exports.select = ({ shard_ids, insert_last = false }) => {
  const update = db.prepare(`UPDATE shards SET selected=1, 
    position=@position WHERE id=@id`);
  const position = db
    .prepare(
      `SELECT ${insert_last ? 'max' : 'min'}(position)
      AS position FROM shards`
    )
    .get().position;
  const startPosition = insert_last
    ? position + 1
    : position - shard_ids.length;

  shard_ids.forEach((id, idx) =>
    update.run({ id, position: idx + startPosition })
  );
};
// Deselect 1 shard (along with adding issue)
exports.deselect = id => {
  db.prepare(
    `UPDATE shards SET selected=0, position=NULL 
    WHERE id=?`
  ).run(id);
};
// Update positions of selected shards, takes shard_id order array
// TODO: maybe deselect all and update positions after to make sure we
// dont have leftovers
exports.updatePositions = ({ ordered_ids }) => {
  const update = db.prepare(`UPDATE shards SET position=@position
    WHERE id=@id`);

  db.transaction(arr =>
    arr.forEach((id, idx) => update.run({ id, position: idx }))
  )(ordered_ids);
};
exports.connect = (id, { parent_id: parentId }) => {
  console.log(id, parentId);
  db.prepare(
    `UPDATE shards SET selected=0, position=NULL,
    connected_to=@parentId 
    WHERE id=@id`
  ).run({ id, parentId });
};
exports.disconnect = id => {
  db.prepare(`UPDATE shards SET connected_to=NULL WHERE id=?`).run(id);
};
