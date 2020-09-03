const User = require('../models/User');
const jwt = require('jsonwebtoken');

// handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: '', password: '' };

  // incorrect email
  if ((err.message = 'incorrect email')) {
    errors.email = 'that email is not registered';
  }

  // incorrect password
  if ((err.message = 'incorrect password')) {
    errors.password = 'that password is incorrect';
  }

  // duplicate key error code
  if (err.code === 11000) {
    errors.email = 'That email already exists';
    return errors;
  }

  // validaton errors
  if (err.message.includes('User validation failed')) {
    // loop through errors object
    Object.values(err.errors).forEach(({ properties }) => {
      // console.log(properties);
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: maxAge,
  });
};

// GET  /signup
module.exports.signup_get = (req, res) => {
  res.render('signup');
};

module.exports.login_get = (req, res) => {
  res.render('login');
};

// POST localhost:3000/signup
module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    // create a new user
    const user = await User.create({ email, password });

    // create a jsonwebtoken
    const token = createToken(user._id);

    // put the jsonwebtoken in a cookie. httpOnly so it can't be accessed from the front end
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });

    // send the cookie to the user
    res.status(201).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

// POST localhost:3000/login
module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    // create a jsonwebtoken
    const token = createToken(user._id);

    // put the jsonwebtoken in a cookie. httpOnly so it can't be accessed from the front end
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });

    res.status(200).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.logout_get = (req, res) => {
  // delete the cookie and redirect to home page
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/');
};
