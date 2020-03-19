const db = require('./db').db;

exports.change = ({ name, value }) => {
  db.prepare(`UPDATE settings SET value=@value WHERE name=@name`).run({
    name,
    value,
  });
};
