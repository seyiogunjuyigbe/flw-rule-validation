const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const { PORT } = require('./config/constants');
const routes = require('./routes');
const { stringifyBody } = require('./middlewares/validate');

const app = express();

const port = process.env.port || PORT || 3000;

app.use(cors());
app.use(
  bodyParser.json({
    limit: '5mb',
    type: 'application/json',
  })
);

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      message: 'Invalid JSON payload passed.',
      status: 'error',
      data: null,
    });
  }
  next();
});
app.use(stringifyBody);

app.use(morgan('dev'));

app.use(routes);

app.listen(port, () => console.log(`API listening on port ${port}`));
