require('dotenv').config();
const cookieParser = require('cookie-parser');
const express = require('express');
const {
  verifyToken,
  decodeToken,
} = require('./middlewares/authentication.middleware');

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  '/',
  verifyToken,
  decodeToken,
  require('./controllers/auth.controller')
);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
