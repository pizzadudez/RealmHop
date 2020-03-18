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
  stmts.push(
    db.prepare(
      `CREATE TABLE IF NOT EXISTS settings (
        name TEXT NOT NULL UNIQUE PRIMARY KEY,
        value TEXT
      )`
    )
  );
  const createTables = db.transaction(stmts => {
    stmts.forEach(stmt => stmt.run());
  });
  createTables(stmts);

  // Insert default issues
  const createIssue = db.prepare(
    `INSERT OR IGNORE INTO issues
    (name, description) VALUES (@name, @description)`
  );
  db.transaction(arr => arr.forEach(issue => createIssue.run(issue)))(
    defaultIssues
  );
  // Insert default settings
  const createSetting = db.prepare(
    `INSERT OR IGNORE INTO settings (name, value)
    VALUES (@name, @value)`
  );
  db.transaction(arr => arr.forEach(setting => createSetting.run(setting)))(
    defaultSettings
  );
};

const defaultSettings = [
  {
    name: 'selected_zone',
    value: '1',
  },
];
const defaultIssues = [
  {
    name: 'Unknown',
    description: 'Undetermined issue, could be a good shard to farm on later.',
  },
  {
    name: 'Check later',
    description: 'Native farmers or boxers that might go away.',
  },
  {
    name: 'Hopping boxer',
    description: 'Might leave if pressured enough.',
  },
  {
    name: 'Stubborn boxer',
    description: 'Non hopping boxer that will not leave.',
  },
  {
    name: 'Crowded',
    description: 'This shard is not worth checking again today.',
  },
];
