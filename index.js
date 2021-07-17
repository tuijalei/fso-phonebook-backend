require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')
const { restart } = require('nodemon')

//Configurating express
app.use(express.json())

app.use(express.static('build'))

//Configurating cors
app.use(cors())

//Configurating morgan with created token
morgan.token('json', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :json'))

//Getting frontpage
app.get('/', (req, res) => {
  res.send('<h1>Puhelinluettelo</h1>')
})

//Getting all contacts
app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

//Info page with contact number and current time
app.get('/info', (req, res) => {
  res.send('Phonebook has info for ' + persons.length + ' people <br><br>' + Date().toLocaleString())
})

//Getting a spesific contact from database
app.get('/api/persons/:id', (req, res) => {
  Person.findById(req.params.id).then(person => {
    if (person) {
      res.json(person)
    } else {
      res.status(404).end()
    }
  })
  .catch(error => {
    console.log(error)
    res.status(400).send({ error: 'malformatted id' })
  })
})

//Deleting a contact from server
app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
  .then(result => {
    res.status(204).end()
  })
  .catch(error => next(error))
})  

//Adding a new contact to database
app.post('/api/persons', (req, res) => {
    const personBody = req.body
  
    //Check if name or number is missing
    if (personBody.name === undefined || personBody.number === undefined) {
      return res.status(400).json({ error: 'Name or number is missing' })}

    //Create a new contact
    const person = new Person({
      name: personBody.name,
      number: personBody.number
    })
  
    //Sending the contact to database
    person.save().then(savedPerson => {
      res.json(savedPerson)
    })
  })

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})