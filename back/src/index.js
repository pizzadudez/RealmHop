const express = require('express');
const path = require('path');

const db = require('./models/db');
const Router = require('./routes');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../../front/build')));
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '../../front/build', 'index.html'))
);

app.use('/api', Router);

db.init();

app.listen(1001, () => {
  console.log('Server running on port: 1001');
});
