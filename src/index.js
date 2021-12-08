const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

// Middleware responsible for checking if account exists
function checksExistsUserAccount( request, response, next ) {
  // Complete aqui

  const { username } = request.headers

  const user = users.filter( user => { user.username === username })

  if( !user ) {
    return response.status(400).json({error: "User doesn`t exists!"})
  }

  request.user = user

  return next()
}

app.post('/users', (request, response) => {
  // Complete aqui
  const { name, username } = request.body

  const userExists = (users.some( user => user.username === username ))

  if( userExists ) {
    return response.status(400).json({ error: "User already exists!" })
  }

  users.push({
    name,
    username,
    id: uuidv4(),
    todo: []
  })

  let user = []

  users.forEach( u => { (u.username === username) ? user.push(u) : [] })

  return response.status(200).json(user)
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;