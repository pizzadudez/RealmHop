const db = require('./db').db;

exports.getAll = () => {
  const zones = db
    .prepare(
      `SELECT DISTINCT z.id, z.name,
      group_concat(s.id) OVER (
        PARTITION BY zone_id
        ORDER BY position ASC NULLS LAST
        ROWS BETWEEN UNBOUNDED PRECEDING
        AND UNBOUNDED FOLLOWING
      ) as shard_ids
      FROM shards s
      LEFT JOIN zones z ON z.id = s.zone_id
      WHERE s.inactive = 0`
    )
    .all();
  const zonesById = Object.fromEntries(
    zones.map(z => [
      z.id,
      {
        ...z,
        shard_ids: z.shard_ids.split(',').map(Number),
      },
    ])
  );
  const activeZoneId = db
    .prepare(`SELECT value FROM settings WHERE name='selected_zone'`)
    .pluck()
    .get();

  return {
    active_zone_id: parseInt(activeZoneId),
    zones: zonesById,
  };
};
