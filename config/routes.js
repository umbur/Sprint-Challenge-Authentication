const axios = require('axios');
const bcrypt = require('bcryptjs');
const db = require('../database/dbConfig');
const { authenticate } = require('../auth/authenticate');

module.exports = server => {
  server.post('/api/register', register);
  server.post('/api/login', login);
  server.get('/api/jokes', authenticate, getJokes);
};

function register(req, res) {
  // implement user registration
  let user = req.body;
  console.log('user:',user)
  if(user.username && user.password) {
    const hash = bcrypt.hashSync(user.password, 3)
    user.password = hash
    db('users').insert(user)
    .then(result => {
      const [id] = result;
      db('users').where({id})
      .first()
      .then(userAdded => {
        res.status(200).json(userAdded)
      })
      .catch(err => {
        console.log(err)
        res.status(500).json({message: 'Error accessing DB'})
      })
    })
    .catch(err => {
      res.status(400).json({message: "Error, probably the user already exists"})
      console.log(err);
    })
  } else {
    res.status(500).json({message: "Error, probably you've made a mistake"})
  }
}

 
function login(req, res) {
  // implement user login
}

function getJokes(req, res) {
  const requestOptions = {
    headers: { accept: 'application/json' },
  };

  axios
    .get('https://icanhazdadjoke.com/search', requestOptions)
    .then(response => {
      res.status(200).json(response.data.results);
    })
    .catch(err => {
      res.status(500).json({ message: 'Error Fetching Jokes', error: err });
    });
}
