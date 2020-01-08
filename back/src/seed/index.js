const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./hop_realms.sqlite3', err => {
  err ? console.log(err) : console.log('Database connected');
});
const db2 = new sqlite3.Database('../../database.sqlite3', err => {
  err ? console.log(err) : console.log('Database connected');
});

db.all("SELECT * FROM hop_realms", (err, rows) => {
  db2.serialize(() => {
    db2.run('BEGIN TRANSACTION');
    rows.forEach(row => {
      db2.run("INSERT INTO realms (name) VALUES(?)", row.name, err => {
        if (err) console.log(err);
      })
    })
    db2.run('COMMIT TRANSACTION', err => console.log(err));
  })
});

