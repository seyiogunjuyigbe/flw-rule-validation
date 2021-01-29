const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const { PORT } = require('./config/constants');
const routes = require('./routes');
const stringifyBody = require('./utils/utils');

const app = express();

const port = process.env.port || PORT || 3000;

app.use(cors());
app.use(
  bodyParser.json({
    limit: '5mb',
    type: 'application/json',
  })
);
app.use(
  bodyParser.urlencoded({
    limit: '5mb',
    extended: true,
  })
);
app.use(stringifyBody);
// log every request to the console
app.use(morgan('dev'));

app.use(routes);

app.all('*', (req, res) => {
  return res.status(404).json({
    error: true,
    message: 'Requested route not found',
  });
});

// error handling middleware
app.use((err, req, res) => {
  console.error(err.stack || err.message || err);
  res.status(500).json({
    error: true,
    message: err.stack || err.message || err,
  });
});

app.listen(port, () => console.log(`API listening on port ${port}`));
