const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

// Middleware responsible for checking if user exists
function checksExistsUserAccount( request, response, next ) {
  const { username } = request.headers

  const user = users.find( user => user.username === username )

  if( !user ) {
    return response.status(404).json({error: "User doesn`t exists!"})
  }

  request.user = user

  return next()
}

app.post('/users', (request, response) => {
  const { name, username } = request.body

  const userExists = (users.some( user => user.username === username ))

  if( userExists ) {
    return response.status(400).json({ error: "User already exists!" })
  }

  users.push({
    name,
    username,
    id: uuidv4(),
    todos: []
  })

  const user = users.find( user => user.username === username )

  return response.status(201).json(user)
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request

  return response.status(200).json(user.todos)
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request

  const { title, deadline } = request.body

  const todos = user.todos

  todos.push({
    id: uuidv4(),
    title,
    done:false,
    deadline: new Date(deadline),
    created_at: new Date()
  })

  return response.status(201).json(user.todos.find(task => task.title === title))
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { id } = request.params
  const { title, deadline } = request.body
  const { user } = request

  const ifTaskExists = (user.todos.some(tasks => tasks.id === id) )

  if ( !ifTaskExists ) {
    return response.status(404).json({error: "Task doesn't exists!"})
  }

  user.todos.forEach(task => {
    if( task.id === id ) {
      task.title = title
      task.deadline = deadline
    }
  })

  return response.status(200).send()
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { id } = request.params
  const { user } = request

  const ifTaskExists = (user.todos.some(tasks => tasks.id === id) )

  if ( !ifTaskExists ) {
    return response.status(404).json({error: "Task doesn't exists!"})
  }

  user.todos.forEach(task => {
    if( task.id === id ) {
      task.done = true
    }
  })

  return response.status(200).send()
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { user } = request
  const { id } = request.params

  const ifTaskExists = (user.todos.some(tasks => tasks.id === id) )

  if ( !ifTaskExists ) {
    return response.status(404).json({error: "Task doesn't exists!"})
  }

  user.todos.forEach( task => {
    if( task.id === id ) {
      console.log(task)
      user.todos.splice( user.todos.indexOf(task), 1 )
    }
  })

  return response.status(204).send()
});

module.exports = app;