const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./hop_realms.sqlite3', err => {
  err ? console.log(err) : console.log('Database connected');
});
const db2 = new sqlite3.Database('../../database.sqlite3', err => {
  err ? console.log(err) : console.log('Database connected');
});

db.all("SELECT * FROM hop_realms", (err, rows) => {
  const sql = `INSERT INTO realms (name, position, updated_at) 
               VALUES(?, ?, datetime('now'))`;
  db2.serialize(() => {
    db2.run('BEGIN TRANSACTION');
    rows.forEach((row, idx) => {
      const values = [row.name, idx];
      db2.run(sql, values, err => {
        if (err) console.log(err);
      });
    });
    db2.run('COMMIT TRANSACTION', err => console.log(err));
  });
});

//-----------------------------------------------------------------------------
// Issues
//-----------------------------------------------------------------------------

const issues = [
  {
    name: 'unknown',
    description: 'Check back later.'
  },
  {
    name: 'high_traffic',
    description: 'Check back later.'
  },
  {
    name: 'multiboxer',
    description: 'Multiboxer'
  },
  {
    name: 'multiboxer_ground',
    description: 'Multiboxer without flying, they tend to not leave.'
  },
  {
    name: 'bot',
    description: 'Long term bot present on this realm.'
  },
  {
    name: 'farmer',
    description: 'Realm native farmer, annoying and disruptive.'
  },
];

db2.serialize(() => {
  const sql = "INSERT INTO issues (name, description) VALUES(?, ?)";
  db2.run('BEGIN TRANSACTION');
  issues.forEach(row => {
    db2.run(sql, [row.name, row.description], err => {
      if (err) console.log(err);
    });
  });
  db2.run('COMMIT TRANSACTION', err => console.log(err));
});