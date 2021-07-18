require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

//Configurating express
app.use(express.json())

app.use(express.static('build'))

//Configurating cors
app.use(cors())

//Configurating morgan with created token
morgan.token('json', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :json'))

//Adding a new contact to database
app.post('/api/persons', (req, res, next) => {
  const personBody = req.body

  //Check if name or number is missing
  if (!personBody.name) {
    return res.status(400).json({ error: 'Name  is missing' })}
    
  if (!personBody.number) {
    return res.status(400).json({ error: 'Number  is missing' })}

  //Create a new contact
  const person = new Person({
    name: personBody.name,
    number: personBody.number
  })

  //Sending the contact to database
  person.save().then(savedPerson => {
    res.json(savedPerson.toJSON())
  })
  .catch(error => next(error))
})

//Updating an old contact to database
app.put("/api/persons/:id", (req, res, next) => {
  const body = req.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then((updatedPerson) => {
      res.json(updatedPerson);
    })
    .catch((error) => next(error));
});

//Getting frontpage
app.get('/', (req, res) => {
  res.send('<h1>Puhelinluettelo</h1>')
})

//Getting all contacts
app.get('/api/persons', (req, res, next) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
  .catch(error => next(error))
})

//Info page with number of contacts and current time
app.get('/info', (req, res) => {

  Person.countDocuments({}).then(people => {
    res.send('Phonebook has info for ' + people + ' people <br><br>' + Date().toLocaleString())
  })
})

//Getting a spesific contact from database
app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id).then(person => {
    if (person) {
      res.json(person)
    } else {
      res.status(404).end()
    }
  })
  .catch(error => next(error))
})

//Deleting a contact from database
app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
  .then(result => {
    res.status(204).end()
  })
  .catch(error => next(error))
})  

//Configurating handler for unknown addresses
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

//Configurating handler for casterrors
const errorHandler = (error, req, res, next) => {
  console.log(error.message)
  
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'TypeError') {
    return res.status(400).send({ error: 'value not expected type'})
  } else if (error.name === 'ReferenceError'){
    return res.status(400).send({ error: 'variable doesnt exist' })
  } else if (error.name === 'ValidationError'){
    return res.status(400).json({ error: error.message})
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`)
})