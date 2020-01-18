const express = require('express');
const Router = require('./routes')

const app = express();
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

app.use('/api', Router);

app.listen(1001, () => {
  console.log('Server running on port: 1001')
});