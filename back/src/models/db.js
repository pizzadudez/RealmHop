const Database = require('better-sqlite3');

const db = Database(
  './db.sqlite3'
  // { verbose: console.log }
);
db.pragma('foreign_keys = ON');

exports.db = db;

exports.init = () => {
  const stmts = [];
  stmts.push(
    db.prepare(
      `CREATE TABLE IF NOT EXISTS zones (
        id INTEGER NOT NULL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE
      )`
    )
  );
  stmts.push(
    db.prepare(
      `CREATE TABLE IF NOT EXISTS realms (
        id INTEGER NOT NULL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        merged_realms TEXT,
        region TEXT NOT NULL,
        population TEXT,
        roleplay INTEGER DEFAULT 0,
        group_id INTEGER DEFAULT NULL
      )`
    )
  );
  stmts.push(
    db.prepare(
      `CREATE TABLE IF NOT EXISTS realm_connections (
        id INTEGER NOT NULL PRIMARY KEY,
        first INTEGER NOT NULL,
        second INTEGER NOT NULL,
        created_at TEXT,
        FOREIGN KEY (first) REFERENCES realms (id) ON DELETE CASCADE, 
        FOREIGN KEY (second) REFERENCES realms (id) ON DELETE CASCADE,
        UNIQUE(first, second)
      )`
    )
  );
  stmts.push(
    db.prepare(
      `CREATE TABLE IF NOT EXISTS shards (
        id INTEGER NOT NULL PRIMARY KEY,
        zone_id INTEGER NOT NULL,
        realm_id INTEGER NOT NULL,
        selected INTEGER DEFAULT 1,
        position INTEGER DEFAULT NULL,
        score INTEGER DEFAULT 0,
        inactive INTEGER DEFAULT 0,
        connected_to INTEGER DEFAULT NULL,
        FOREIGN KEY (zone_id) REFERENCES zones (id) ON DELETE CASCADE,
        FOREIGN KEY (realm_id) REFERENCES realms (id) ON DELETE CASCADE,
        FOREIGN KEY (connected_to) REFERENCES shards (id),
        UNIQUE(zone_id, realm_id)
      )`
    )
  );
  stmts.push(
    db.prepare(
      `CREATE TABLE IF NOT EXISTS issues (
        id INTEGER NOT NULL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        description TEXT DEFAULT NULL,
        color TEXT DEFAULT NULL
      )`
    )
  );
  stmts.push(
    db.prepare(
      `CREATE TABLE IF NOT EXISTS shards_issues (
        id INTEGER NOT NULL PRIMARY KEY,
        shard_id INTEGER NOT NULL,
        issue_id INTEGER NOT NULL,
        created_at TEXT,
        FOREIGN KEY (shard_id) REFERENCES shards (id) ON DELETE CASCADE,
        FOREIGN KEY (issue_id) REFERENCES issues (id) ON DELETE CASCADE
      )`
    )
  );
  const createTables = db.transaction(stmts => {
    stmts.forEach(stmt => stmt.run());
  });
  createTables(stmts);

  // default issue needed for other operations
  db.prepare(
    `INSERT OR IGNORE INTO issues
    (name, description) VALUES(@name, @description)`
  ).run({
    name: 'connected',
    description: 'Shard is currently connected with another.',
  });
};
