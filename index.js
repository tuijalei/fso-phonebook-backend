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

//Getting a spesific contact from server
app.get('/api/persons/:id', (req, res) => {
  Person.findById(req.params.id).then(person => {
    res.json(person)
  })
  })

//Deleting a contact from server
app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(p => p.id !== id)
    res.status(204).end()
  })  

//Adding a new contact to server
app.post('/api/persons', (req, res) => {
    const personBody = req.body
  
    //Check if name or number is missing
    if (personBody.content === undefined) {
      return res.status(400).json({ error: 'Name or number is missing' })}

    //Create a new contact
    const person = new Person({
      name: personBody.name,
      number: personBody.number
    })
  
    person.save().then(savedPerson => {
      res.json(savedPerson)
    })
  })

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})