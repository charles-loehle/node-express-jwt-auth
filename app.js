const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const path = require('path');

const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json());

// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI =
  'mongodb+srv://charlesloehle:charles123@netninja-node-express-j.xwj3e.mongodb.net/node-express-jwt-auth';
mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((result) =>
    app.listen(3000, () => {
      console.log(`Example app listening at http://localhost:3000`);
    })
  )
  .then(() => console.log('DB connected'))
  .catch((err) => console.log(err));

// routes
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', (req, res) => res.render('smoothies'));

app.use(authRoutes);
