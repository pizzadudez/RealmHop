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
