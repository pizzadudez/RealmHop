const express = require('express');

const app = express();
app.listen(1001, () => {
  console.log('Server running on port: 1001')
});