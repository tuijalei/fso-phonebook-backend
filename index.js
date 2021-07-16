const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

//Configurating express
app.use(express.json())

app.use(express.static('build'))

//Configurating cors
app.use(cors())

//Configurating morgan with created token
morgan.token('json', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :json'))


let persons = [
    { 
        "name": "Arto Hellas", 
        "number": "040-123456",
        "id": 1
      },
      { 
        "name": "Ada Lovelace", 
        "number": "39-44-5323523",
        "id": 2
      },
      { 
        "name": "Dan Abramov", 
        "number": "12-43-234345",
        "id": 3
      },
      { 
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122",
        "id": 4
      }       
]
      

//Getting frontpage
app.get('/', (req, res) => {
  res.send('<h1>Puhelinluettelo</h1>')
})

//Getting all contacts
app.get('/api/persons', (req, res) => {
    res.json(persons)
  })

//Info page with contact number and current time
app.get('/info', (req, res) => {
    res.send('Phonebook has info for ' + persons.length + ' people <br><br>' + Date().toLocaleString())
  })

//Getting a spesific contact from server
app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(p => p.id === id)
    
    //Check if spesific id used in contacts
    if (person) {
      res.json(person)
    } else {
      res.status(404).end()
    }
  })

//Deleting a contact from server
app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(p => p.id !== id)
    res.status(204).end()
  })  

//Generating random value for new id
const generateId = () => {
    return Math.random() * (1000-1) + 1
}

//Adding a new contact to server
app.post('/api/persons', (req, res) => {
    const personBody = req.body
    console.log(personBody)
    let nameAlreadyUsed = persons.map(p => p.name).includes(personBody.name)
    console.log(nameAlreadyUsed)
  
    //Check if name or number is missing
    if (!personBody.name || !personBody.number) {
      return res.status(400).json({ 
        error: 'Name or number is missing' 
      })
    }
    
    //Check if name already used in contacts
    if (nameAlreadyUsed) {
      return res.status(400).json({
        error: 'Name must be unique'
      })
    }

    const person = {
        name: personBody.name,
        number: personBody.number,
        id: generateId(),
    }
  
    persons = persons.concat(person)
  
    res.json(person)
  })

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})